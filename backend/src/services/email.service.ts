import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * 发送验证码邮件
 * @param to 接收者邮箱
 * @param code 验证码
 */
export const sendVerificationEmail = async (to: string, code: string) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: '【青柠社团管理系统】注册验证码',
    html: `
      <div style="padding: 20px; background-color: #f1f8f1; border-radius: 10px; font-family: sans-serif;">
        <h2 style="color: #4caf50;">您好！</h2>
        <p>感谢您注册青柠社团管理系统。您的注册验证码为：</p>
        <div style="font-size: 32px; font-weight: bold; color: #4caf50; margin: 20px 0; text-align: center; letter-spacing: 5px;">
          ${code}
        </div>
        <p>验证码有效期为 5 分钟，请尽快完成注册。如果不是您本人操作，请忽略此邮件。</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999;">此邮件由系统自动发出，请勿回复。</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};
