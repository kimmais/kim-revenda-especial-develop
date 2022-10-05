using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using admin.Models;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration.Binder;
namespace admin.Services
{
    public class EmailServices
    {
        private readonly IConfiguration _config;
        public string adminDatabase => _config.GetValue<string>("ConnectionStrings:AdminDatabase");
        public EmailServices(IConfiguration config)
    {
      _config = config;
    }
        private static EmailTemplate EmailTemplate(string template){
            switch (template)
            {
                case "register":
                    var subject = "Kim +";
                    var body =  @"<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'><html xmlns='http://www.w3.org/1999/xhtml' xmlns:o='urn:schemas-microsoft-com:office:office'><head> <meta charset='UTF-8'> <meta content='width=device-width, initial-scale=1' name='viewport'> <meta name='x-apple-disable-message-reformatting'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <meta content='telephone=no' name='format-detection'> <title></title><!--[if (mso 16)]> <style type='text/css'> a{text-decoration: none;}</style><![endif]--><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings></xml><![endif]--> <link href='https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i' rel='stylesheet'> </head><body> <div class='es-wrapper-color'><!--[if gte mso 9]><v:background xmlns:v='urn:schemas-microsoft-com:vml' fill='t'><v:fill type='tile' color='#F8F9FD'></v:fill></v:background><![endif]--> <table class='es-wrapper' width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-email-paddings' valign='top'> <table cellpadding='0' cellspacing='0' class='es-content esd-header-popover' align='center'> <tbody> <tr> <td class='esd-stripe' align='center' bgcolor='#F8F9FD' style='background-color: #F8F9FD;'> <table bgcolor='#FFFFFF' class='es-content-body' align='center' cellpadding='0' cellspacing='0' width='600'> <tbody> <tr> <td class='esd-structure es-p10t es-p15b es-p30r es-p30l' align='left'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='540' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td align='center' class='esd-block-image' style='font-size: 0px;'><a target='_blank'><img src='https://demo.stripocdn.email/content/guids/5f8b9944-bf94-4994-9362-39c33310fde5/images/23631599162645806.png' alt style='display: block;' width='130'></a></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> <table cellpadding='0' cellspacing='0' class='es-content' align='center'> <tbody> <tr> <td class='esd-stripe' align='center' bgcolor='#F8F9FD' style='background-color: #F8F9FD;'> <table bgcolor='transparent' class='es-content-body' align='center' cellpadding='0' cellspacing='0' width='600' style='background-color: transparent;'> <tbody> <tr> <td class='esd-structure es-p20t es-p10b es-p20r es-p20l' align='left'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='560' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td align='center' class='esd-block-text es-p10b'> <h1>Seu cadastro foi realizado&nbsp;</h1> </td></tr><tr> <td align='center' class='esd-block-text es-p10t es-p10b'> <p>Espere a aprovação da Operadora Kim+</p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr><tr> <td class='esd-structure es-p15t es-m-p15t es-m-p0b es-m-p0r es-m-p0l' align='left'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='600' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td align='center' class='esd-block-image' style='font-size: 0px;'><a target='_blank'><img class='adapt-img' src='https://uxyja.stripocdn.email/content/guids/CABINET_1ce849b9d6fc2f13978e163ad3c663df/images/3991592481152831.png' alt style='display: block;' width='600'></a></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> <table cellpadding='0' cellspacing='0' class='es-content' align='center'> <tbody> <tr> <td class='esd-stripe' align='center' bgcolor='#071F4F' style='background-color: #071F4F; background-image: url(https://uxyja.stripocdn.email/content/guids/CABINET_1ce849b9d6fc2f13978e163ad3c663df/images/10801592857268437.png); background-repeat: no-repeat; background-position: center top;' background='https://uxyja.stripocdn.email/content/guids/CABINET_1ce849b9d6fc2f13978e163ad3c663df/images/10801592857268437.png'> <table bgcolor='#FFFFFF' class='es-content-body' align='center' cellpadding='0' cellspacing='0' width='600'> <tbody> <tr> <td class='esd-structure es-p40t es-p40b es-p30r es-p30l' align='left'> <table cellpadding='0' cellspacing='0' width='100%' bgcolor='#18389D'> <tbody> <tr> <td width='540' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%' > <tbody> <tr> <td align='center' class='esd-block-spacer' height='20'></td></tr><tr> <td align='left' class='esd-block-text es-p10b'> <h1 style='text-align: center; color: #FFFFFF;'><b>Venda mais seja Kim+</b></h1> </td></tr><tr> <td align='center' class='esd-block-text es-p10t es-p10b'> <p style='color: #FFFFFF;'>Estamos trabalhando para entregar a você e seus cliente o melhor serviço</p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </div></body></html>";
                    return new EmailTemplate { body=body , subject=subject };
                default:
                    return new EmailTemplate { body="" , subject="" };
            }
        }
        private  EmailCredential EmailCredentialSql(string email){
            var sql =  @"SELECT TOP 1 cd_parametro_email
                            ,ds_from as email
                            ,ds_usuario as UserName
                            ,ds_senha as password
                            ,ds_host as host
                            ,nu_porta as port
                            ,ic_kimmais
                            ,ic_kimmais_revenda
                            FROM tb_parametro_email
                            where ds_from = @email";

            using (var connection = new SqlConnection(_config.GetValue<string>("ConnectionStrings:AdminDatabase")))
            {
            return connection.QuerySingle<EmailCredential>(sql,new
                  {
                      email = email
                  });
            }
        }
        public void SendEmail(string mailFrom,string nameFrom, string userMail, string userName, string mailTemplate)
        {
            var emailTemplate = EmailTemplate(mailTemplate);
            
            var teste = EmailCredentialSql(mailFrom);
            
            MailMessage mail = new MailMessage()
                {
                    From = new MailAddress(mailFrom, nameFrom)
                };
                mail.To.Add(new MailAddress(userMail));
                mail.CC.Add(new MailAddress("phadc28@gmail.com"));
                mail.CC.Add(new MailAddress("thiago.soares@kimmais.com.br"));
                // mail.CC.Add(new MailAddress("igorbotelhop@gmail.com"));
                mail.Subject = emailTemplate.subject;
                mail.Body = emailTemplate.body;
                mail.IsBodyHtml = true;
                mail.Priority = MailPriority.High;
                    using (var smtp = new SmtpClient())
                    {
                        smtp.Credentials = new NetworkCredential
                        {
                            UserName = teste.userName,
                            Password = teste.password
                        };
                        smtp.Host = teste.host;
                        smtp.Port = teste.port;
                        smtp.Send(mail);
                    }
        }
    }
}