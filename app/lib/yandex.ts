import jwt from "jsonwebtoken";
import axios from "axios";

export async function getYandexIamToken() {
    const serviceAccountId = "ajed79udetdhve8l022p";
    const keyId = "ajeruk6vmpjhlvqpb6ld";

    const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDUrBhPIJoDSYke
IwQpPNa1im5FjoxJfg/Ucj642o1n3EcQbWhY5oWT2UFCldfnWkuj+pcHYuTcb+g4
loIOz1D7ZNMKSlhbhfBKtAIm2FOdBPxkBs1Il/MBsC9oFzqYw3uuScFZhJPblbOP
t6KWVLvljJBdWkpU+pAUeFQwdBMBe4lMSDwAjXy7EEjMAvBbfgKMNKByFZAhKEKO
D4Ve7hdCzqoP61D7hbcJiBFdLzahoEaCxU+1LNi+/5exNyOGHyyE68uybDn94Ku6
owj4SRzJhhSHR1mMNVbKGaHxgRvkWjDas0azTTUBNMJPzOJ2RoujyfiBqYPClLMz
p3k/yuo5AgMBAAECggEAAuhXbL2FXYYj2cWgyO+L/+9kko7gXCDdFop5UQ2r4T+h
uRfF1XFRYjQWMFLcIM2bOyKx7efsORdOlXd5T7qF4On/+KQLkTTDlEHhxaYvfnYS
/Usag2OQbvV5sHKg2nXRuxBHFHI7k0T4r35TOrrt1rWVQ7F4UrEaRy1d+Uuc9ugz
Fi3HJEmQps2BibqDRUU9Cnz9MDdBSgHlXHQPl78HIql8itLOFWlFO8lRZ13XGisp
XufnfpFPPgJ/HM6z/OwXQ5vszOldYiDCuKQ7MMLEOKW1yP2cTDzEhQOoGBVasW3A
eFAvIwWDprKrGIZKGQq5jiCwPGnxWe2ZL9eFsSn4AQKBgQDw66byxxHXB7bg8chx
BX3jHXKXdyMNBjx1snJSFUN9mYJX48pDG8AmXKCOops1/pkQLF4Imqt0X8eqGkMr
Xr+9vvrlxTRnar1KJEhqr0ARksuK+IkAUvjX7wl/agPaqy0lNJ6TJD8fidp1bRfs
4YAVSfmnYAI+iQ0l7rOcdcYLhQKBgQDh+8/EECNhBilO7aR/ZdrkFQj8EIjwdXCN
VFnCMzQQCR7Vgyw5PauqqL8rrRRwomGhLOVy9/1yR91SXCYHHjUYAHVaQlBPSoaR
L8vPJQwxGHZp7cX6+ze1NCfRde6/SQyAxeTbySebHrClHb1aV/gBiSw2h+NWZ4s7
twkjc0JAJQKBgQCuUhSOfjQOXuqYgNoDzXF1MA2GQxH9jpGYp/HIKtKWwshpR81G
GYJDP6p9CnM78mhWJ4QyvZdpsRQLpM0NSJV8ef+Y2cQ9QCKOzwoHB59YF9tnRsX6
kg60T6WTp+X6Bvm3fgdveD6kV17WsIUrRU8kGE6oKPP2w7vbwof7ocwW8QKBgQDN
DZwB8Q7ZPCkBeHs6KmcLbNbhOfO4FShS5YYoxCNqpYv3+3WGXyJE0afd7shMR9vE
zyNIRiQQrYry77CF5vAQXmIdy2xp9lrSpQcPaDN+3Q6doeZyjb+HydKTqqo/of4Z
XvgCQq2QgLGSscCemJHuetTGillLjtr1DWnaY/xqjQKBgFksAFZyx/5CrFFyh/Kc
wboT7lvSKULub9EbsWfRxKdL8zmxEBEuQfNy7vDRA7hANJK2XAPgWbpiUuEBcJv3
LHJ6d+2JycxncD87GQrqWdrsPY59seZqC14iwvWyzdieDAGk1f5rcSF7Tio4jxKB
tfAtggdxJ1KwIN7dl4YIFHNN
-----END PRIVATE KEY-----`;

    const now = Math.floor(Date.now() / 1000);

    const payload = {
        aud: "https://iam.api.cloud.yandex.net/iam/v1/tokens",
        iss: serviceAccountId,
        iat: now,
        exp: now + 3600,
    };

    const jwtToken = jwt.sign(payload, privateKey, {
        algorithm: "PS256",
        header: { kid: keyId },
    });

    const res = await axios.post(
        "https://iam.api.cloud.yandex.net/iam/v1/tokens",
        { jwt: jwtToken }
    );

    return res.data.iamToken;
}