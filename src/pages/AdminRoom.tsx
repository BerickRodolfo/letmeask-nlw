import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { useNavigate, useParams } from 'react-router-dom'


import '../styles/room.scss'   
//import { useAuth } from '../hooks/useAuth'
import { Question } from '../components/Question'
import { UseRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

export function AdminRoom(){

        
    type RoomParams = {
        id: string;
    }

    //const { user } = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id!
    const { title, questions} = UseRoom(roomId)
    const navigate = useNavigate();

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        navigate('/');
        
    }


    async function handleDeleteQuestion(questionId : string){
        if(window.confirm('Tem certeza que deseja excluir essa pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionasAnswered(questionId : string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });
    }

    async function handleHighlightQuestion(questionId : string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        });
    }

   

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="ImageLogo" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button 
                            isOutlined
                            onClick={handleEndRoom}
                        >
                            Encerrar Sala
                        </Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala : {title}</h1>
                    {questions.length > 0 && <span>{questions.length} Perguntas</span>}
                </div>

                
                
               <div className="question-lost">
                {questions.map(question => {
                        return(
                            <Question 
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                 {!question.isAnswered && (
                                     <>
                                      <button
                                      type="button"
                                      onClick={() => handleCheckQuestionasAnswered(question.id)}
                                  >
                                      <img src={checkImg} alt="Marcar pergunta como respondida"/>
                                   </button>
                                   <button
                                      type="button"
                                      onClick={() => handleHighlightQuestion(question.id)}
                                  >
                                      <img src={answerImg} alt="Dar destaque a pergunta"/>
                                   </button>
                                   </>
                                 )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover Pergunta"/>
                                 </button>
                            </Question>
                        )
                    })}
               </div>
            </main>
        </div>
    )
}