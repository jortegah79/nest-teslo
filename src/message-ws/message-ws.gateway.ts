import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { log } from 'console';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService
  ) { }

  async handleConnection(client: Socket, ...args: any[]) {
   // console.log('Cliente conectado', client);
    const token = client.handshake.headers.authentication as string;
    
    let payload: JwtPayload;
    try {
      payload= this.jwtService.verify(token);
      console.log(payload);                  
      await this.messageWsService.registerClient(client,payload.id);

    } catch (error) {
      client.disconnect();
      return;
    }
   // console.log({ token: token });

    console.log({ conectadps: this.messageWsService.getConnectedClients() })
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients())

  }

  handleDisconnect(client: Socket) {
    // console.log('cliente desconectado',client);
    this.messageWsService.removeClient(client.id);
    console.log({ conectadps: this.messageWsService.getConnectedClients() })
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients())
  }
  //para leer los eventos desde cliente
  @SubscribeMessage("message-from-client")
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {

    //messages-from-server

    //emite solo al cliente que envió mensaje
    /* client.emit("messages-from-server", {
       fullname: 'Soy yo',
       message: payload.message || 'no-message'
     })
 */
    //emitir a todos menos al cliente que emitió
    /*client.broadcast.emit("messages-from-server", {
      fullname: 'Soy yo',
      message: payload.message || 'no-message'
    })
*/
    //emitir a todos los cliente a la vez
    this.wss.emit("messages-from-server", {
      fullname: this.messageWsService.getUserFullName( client.id ),
      message: payload.message || 'no-message'
    })


  }

}
