import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, 
  WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-messafe.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    // console.log('Cliente conectado', client.id);
    const token = client.handshake.headers.authentication as string;
    console.log({token});

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);

      console.log({payload});

      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }
  
  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado', client.id);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto){

    //! Emite únicamente al cliente, no a todos.
    // client.emit('message-from-server', {
    //   fullname: 'Soy yo !!',
    //   message: payload.message || 'No message !'
    // });

    //! Emite a todos MENOS al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullname: 'Soy yo !!',
    //   message: payload.message || 'No message !'
    // });
    
    //! Emite a todos incluyendo al cliente que lo emitió.
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'No message !'
    });
    
  }
  


}
