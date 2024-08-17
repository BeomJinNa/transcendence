import smtplib
from email.mime.text import MIMEText
import ssl

def send_custom_email(subject, body, from_email, to_emails, smtp_server='smtp.gmail.com', smtp_port=587, smtp_user=None, smtp_password=None):
    # 이메일 메시지 생성
    msg = MIMEText(body, 'html')  # 'html'로 설정하여 HTML 형식의 본문을 사용할 수 있음
    msg['Subject'] = subject
    msg['From'] = from_email
    msg['To'] = ', '.join(to_emails)

    # SSL 컨텍스트 설정
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE

    try:
        # SMTP 서버에 연결하고 이메일 전송
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls(context=context)
            if smtp_user and smtp_password:
                server.login(smtp_user, smtp_password)
            server.sendmail(from_email, to_emails, msg.as_string())
        print("Email sent successfully")
    except Exception as e:
        print(f"Error sending email: {e}")