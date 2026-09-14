import { mailTransporter } from "../config/mail.config.js";

class MailService {
  async sendTicketConfirmation({
    to,
    userName,
    eventTitle,
    eventDate,
    eventLocation,
    quantity,
    reservationCode
  }) {
    await mailTransporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: `Confirmación de inscripción - ${eventTitle}`,
      html: `
        <h2>Inscripción confirmada</h2>

        <p>Hola ${userName},</p>

        <p>Tu inscripción fue confirmada correctamente.</p>

        <p><strong>Evento:</strong> ${eventTitle}</p>
        <p><strong>Fecha:</strong> ${eventDate}</p>
        <p><strong>Lugar:</strong> ${eventLocation}</p>
        <p><strong>Cantidad:</strong> ${quantity}</p>
        <p><strong>Código de reserva:</strong> ${reservationCode}</p>
      `
    });
  }
}

export const mailService = new MailService();