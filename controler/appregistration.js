const bcrypt = require('bcrypt');
const CentralReg = require('../model/postutmemodel');
const ResetPass = require('../model/resetpassword');
const postutmeModel = require('../model/postutmereg');
const Otp = require('../model/otp.js');
const logger = require('../util/logger');
const mailer = require('../util/Mailer');
const jambDataModel = require('../model/postutmejambdata');

// CLASS FOR APPLICATION SIGNUP
exports.applicationFormreg = async (req, res, next) => {
  try {
    const salt = '$2b$10$ppgyRjL12ppJ0P6k/NEt7O';
    const password = await bcrypt.hash(req.body.password, salt);
    console.log(password);
    const regData = {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      phone: req.body.phone,
      password: password,
    };
    const registered = await CentralReg.create(regData);
    console.log(registered);
    const code = Math.floor(1000 + Math.random() * 9000);
    const code2 = Math.floor(1000 + Math.random() * 9000);
    if (registered) {
      // const registernow = await CentralReg.create(regData);
      await Otp.create({
        email: regData.email,
        phone: regData.phone,
        otpPhone: code,
        otpEmail: code2,
      });

      if (registered != null) {
        console.log(code);

        logger.filecheck(
          'created account with' + regData.email + 'With code' + code,
          1
        );
        mailer(
          'kalchuka@gmail.com',
          'You have successfully registered for postutme',
          'Unzik Mail'
        );
        logger.filecheck('sent Email to ' + regData.email, 1);

        return res.status(200).json({
          code: '00',
          status: 'success',
          data: {
            message: registered,
          },
        });
      } else {
        return res.status(200).json({
          code: '001',
          status: 'error',
          data: {
            message: 'Could not create Account',
          },
        });
      }
      //run the create
    } else {
      logger.filecheck(
        'could not create account as it already exits ' + regData.email,
        '1'
      );
      return res.status(200).json({
        code: '002',
        status: 'error',
        data: {
          message: 'Email Already Exits',
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      code: '003',
      status: 'fail',
      message: 'Something wrong',
    });
    console.log(error);
    logger.filecheck(JSON.stringify(error), '2');
  }
};

exports.postutmeyear = async (req, res, next) => {
  try {
    const response = await postutmeModel('2020-2021').create(req.body);

    return res.status(200).json({
      code: '00',
      status: 'success',
      data: response,
    });
  } catch (error) {
    res.status(200).json({
      code: '00',
      status: 'fail',
      error,
    });
  }
};

exports.otptest = async (req, res, next) => {
  try {
    const data = await Otp.findOne({
      $or: [{ otpPhone: req.body.otpPhone }, { otpEmail: req.body.otpEmail }],
      email: req.body.email,
    });
    console.log(data);
    if (data != null) {
      if (data.status === 1) {
        logger.filecheck(`${data.email} Entered Used OTP`, '1');
        return res.status(200).json({
          code: 'O0',
          status: 'success',
          message: 'OTP USED',
        });
      }

      await Otp.findOneAndUpdate(
        { optKey: data.otpKey, email: data.email },
        { status: 1 }
      );
      await CentralReg.findOneAndUpdate(
        { email: data.email },
        { validated: 1 }
      );
      logger.filecheck(`${data.email} Created OTP`, '1');
      res.status(200).json({
        code: '001',
        status: 'success',
        message: 'OTP Verified',
      });
    } else {
      logger.filecheck(`${data.email} Entered Invalid OTP`, '1');
      return res.status(200).json({
        code: 'O02',
        status: 'error',
        message: 'Invalid OTP',
      });
    }
    // next()
  } catch (error) {
    logger.filecheck(`${error}`, '2');
    return res.status(500).json({
      status: 'fail',
      error,
    });
  }
};

exports.postutmeLogin = async (req, res, next) => {
  try {
    if (!req.body.password || !req.body.email) {
      return res.status(400).json({
        stutus: 'error',
        message: 'Please provide email and password',
      });
    }

    const salt = '$2b$10$ppgyRjL12ppJ0P6k/NEt7O';
    const passwordcompare = await bcrypt.hash(req.body.password, salt);
    console.log(passwordcompare);

    const user = await CentralReg.findOne({ email: req.body.email });
    if (passwordcompare !== user.password) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid Email or Password',
      });
    }
    return res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Something went wrong',
      error,
    });
  }
};

exports.passwordReset = async (req, res, next) => {
  try {
    if (!req.body.email)
      return res.status(401).json({
        status: 'fail',
        message: 'Provide password',
      });
    //Check if email exists
    const user = await CentralReg.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User email does not exist',
      });
    }
    //update status when the token sent is used
    await ResetPass.updateMany({ email: req.body.email }, { status: 1 });

    //Generate reset token
    const resetToken = Math.floor(1000 + Math.random() * 9000);
    await ResetPass.create({
      email: req.body.email,
      passtoken: resetToken,
    });
    //Generate reset url and message
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/#/passwordotp/${resetToken}`;
    const message = `Forgot your password? Click on the link to reset ${resetURL}.\n If you did'nt forget your password, please ignor this email `;
    //Send mail to email
    mailer(req.body.email, message, 'Reset Password');
    console.log('Email Sent');
    f;
    return res.status(200).json({
      code: '00',
      status: 'success',
      message,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error,
    });
  }
};

exports.verifyotp = async (req, res, next) => {
  try {
    const response = await ResetPass.findOne({ passtoken: req.body.passtoken });
    if (response.status === 0) {
      return res.status(200).json({
        code: '00',
        status: 'success',
      });
    } else if (response.status === 1) {
      return res.status(404).json({
        code: '002',
        status: 'Expired Reset token',
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error,
    });
  }
};

exports.changepass = async (req, res, next) => {
  try {
    const user = await CentralReg.findOne({ email: req.body.email });
    if (user == null) {
      return res.status(404).json({
        code: '002',
        status: 'fail',
        message: 'User email not found',
      });
    }
    const salt = '$2b$10$ppgyRjL12ppJ0P6k/NEt7O';
    const newpass = await bcrypt.hash(req.body.password, salt);
    await CentralReg.findOneAndUpdate(
      { email: req.body.email },
      { password: newpass }
    );
    console.log('REACH');
    return res.status(200).json({
      code: '00',
      status: 'success',
      message: 'password changed successfully',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error,
    });
  }
};

exports.jambCheck = async (req, res, next) => {
  try {
    const response = await jambDataModel('2020-2021').findOne({
      j_reg: req.body.j_reg,
    });
    // console.log(response);
    if (response !== null) {
      const resData = await postutmeModel('2020-2021').findOne({
        j_reg: req.body.j_reg,
      });
      // console.log('resData: ', resData);
      if (resData == null) {
        return res.status(200).json({
          code: '00',
          status: 'success',
          data: { response },
        });
      } else {
        return res.status(200).json({
          code: '002',
          message: 'Reg Number has been Linked by another user',
        });
      }
    } else {
      return res.status(404).json({
        code: '002',
        status: 'fail',
        message: 'Not eligible',
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: '002',
      status: 'error',
      error,
    });
  }
};

exports.jambLinking = async (req, res, next) => {
  try {
    const response = await jambDataModel('2020-2021').findOne({
      j_reg: req.body.j_reg,
    });

    // console.log(response);
    if (response !== null) {
      const resData = await postutmeModel('2020-2021').findOne({
        j_reg: req.body.j_reg,
      });

      if (resData == null) {
        const userData = await CentralReg.findOne({ email: req.body.email });

        if (userData !== null) {
          await postutmeModel('2020-2021').create({
            email: req.body.email,
            phone: userData.phone,
            j_reg: req.body.j_reg,
          });

          return res.status(200).json({
            code: '00',
            status: 'success',
            message: 'Jamb reg number linked',
          });
        } else {
          return res.status(200).json({
            code: '00',
            status: 'fail',
            message: 'Please provide a valid Email',
          });
        }
      } else {
        return res.status(200).json({
          code: '00',
          status: 'fail',
          message: 'Reg number has already been linked by another user',
        });
      }
    } else {
      return res.status(200).json({
        code: '00',
        status: 'fail',
        message: 'not eligible',
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: '002',
      status: 'error',
      error,
    });
  }
};

exports.updatePostutmeReg = async (req, res, next) => {
  try {
    const resData = await postutmeModel('2020-2021').findOne({
      email: req.body.email,
    });

    if (resData !== null) {
      await postutmeModel('2020-2021').updateOne(
        { email: req.body.email },
        {
          dob: req.body.dob,
          nextOfKinName: req.body.nextOfKin,
          nextOfKinNumber: req.body.nextOfKinNum,
        }
      );

      return res.status(200).json({
        code: '00',
        status: 'success',
        message: 'updated successfully',
      });
    } else {
      return res.status(200).json({
        code: '00',
        status: 'fail',
        message: 'Invalid Email',
      });
    }
  } catch (error) {
    res.status(200).json({
      code: '002',
      status: 'error',
      message: 'something went wrong',
    });
  }
};

exports.fetchRegData = async (req, res, next) => {
  try {
    const response = await postutmeModel('2020-2021').findOne({
      email: req.body.email,
    });

    if (response !== null) {
      return res.status(200).json({
        code: '00',
        status: 'success',
        data: response,
      });
    } else {
      return res.status(404).json({
        code: '002',
        status: 'fail',
        message: 'Email not found',
      });
    }
  } catch (error) {
    return res.status(200).json({
      code: '002',
      status: 'error',
      message: 'something went wrong',
    });
  }
};

exports.otpreset = async (req, res, next) => {
  try {
    const data = await Otp.find({
      email: req.body.email,
    });
    console.log(data);
    if (data !== null) {
      await Otp.updateMany({ email: req.body.email }, { status: 1 });
      logger.filecheck(`${data.email} Created OTP`, '1');

      return res.status(200).json({
        code: '00',
        status: 'success',
        message: 'Opt updated',
      });
    } else {
      return res.status(200).json({
        code: '00',
        status: 'fail',
        message: 'Invalid Email',
      });
    }
  } catch (error) {
    return res.status(200).json({
      code: '00',
      status: 'error',
      message: 'Error occured while process request',
    });
  }
};

exports.stageCheck = async (req, res, next) => {
  const response = await postutmeModel('2020-2021').findOne({
    email: req.body.email,
  });

  if (response !== null) {
    return res.status(200).json({
      code: '00',
      status: 'success',
      data: response,
    });
  } else {
    return res.status(200).json({
      code: '002',
      status: 'error',
      message: "Can't find User",
    });
  }
};

exports.jambReg = async (req, res, next) => {
  try {
    const response = await jambDataModel.create(req.body);
    console.log(response);
    res.status(200).json({
      status: 'success',
      data: response,
    });
  } catch (error) {
    return res.status(200).json({
      error: 'error',
    });
  }
};

exports.updateForm1 = async (req, res, next) => {
  try {
    const response = await postutmeModel('2020-2021').findOne({
      email: req.body.email,
    });
    if (response !== null) {
      //updates postutme linked document
      await postutmeModel('2020-2021').updateOne(
        { email: req.body.email },
        {
          dob: req.body.dob,
          nextOfKinNumber: req.body.number,
          nextOfKinName: req.body.name,
        }
      );
      console.log('here');
      return res.status(200).json({
        code: '00',
        status: 'success',
        message: 'Successfully updated',
      });
    } else {
      return res.status(200).json({
        code: '001',
        status: 'error',
        message: 'Email Not found',
      });
    }
  } catch (err) {
    // console.log(err);
    return res.status(500).json({
      code: '002',
      status: 'error',
      err,
    });
  }
};
