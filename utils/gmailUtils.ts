import { google, Auth } from 'googleapis';
import fs from 'fs';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const CREDENTIALS_PATH = path.join(__dirname, '../data/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../data/token.json');

export async function authenticate(): Promise<Auth.OAuth2Client> {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw new Error("No se encontró credentials.json en ./data. Descarga las credenciales de Google Cloud.");
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8')).web;
    const { client_id, client_secret } = credentials;
    const redirect_uris = ['http://localhost'];
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (fs.existsSync(TOKEN_PATH)) {
        const token = fs.readFileSync(TOKEN_PATH, 'utf-8');
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    }

    throw new Error('Token no encontrado. Por favor, genera un nuevo token ejecutando `npx tsx generateToken.ts`.');
}

export async function getVerificationCode(): Promise<string> {
    try {
        const auth = await authenticate();
        const gmail = google.gmail({ version: 'v1', auth });

        console.log('Buscando el código de verificación en los correos');

        const response = await gmail.users.messages.list({
            userId: 'me',
            q: 'from: soporte@biosafeapp.com subject:"Código de verificación de BioSafeApp"',
            maxResults: 1,
        });
        
        if (!response.data.messages || response.data.messages.length === 0) {
            console.log('No se encontraron mensajes con el código de verificación.');
            return '';
        }
        const messageId = response.data.messages[0].id!;
        const message = await gmail.users.messages.get({userId: 'me', id: messageId});
        const body = message.data.snippet || '';
        console.log('Mensaje encontrado:', body);
        // Buscar el código de 6 dígitos en el cuerpo del mensaje
        const codeMatch = body.match(/\d{6}/);
        if (codeMatch) {
            console.log('Código de verificación encontrado: ', codeMatch[0]);
            return codeMatch[0];
        } else {
            console.log('No se encontró el código de verificación en el mensaje.');
            return '';
        }
    } catch (error) {
        console.error('Error al autenticar o buscar el código de verificación:', error);
        return '';
    }
}