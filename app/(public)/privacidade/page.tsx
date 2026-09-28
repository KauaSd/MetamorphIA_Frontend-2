import Titulo from "@/components/public/TituloTermos";

export default function Privacidade(){
    return(
        <div className="flex justify-center items-center text-[#433F3F] mt-20">
            <div className="bg-[#FFFDFA] w-800 h-auto p-10 rounded-[70px] flex flex-col gap-10">
                <div className="flex flex-col gap-1">
                    <p className="font-(family-name:--font-text-me-one) text-3xl">Política de Privacidade</p>
                    <div className="flex flex-row gap-1 text-[#797979] text-sm items-center">
                        <p className="font-bold">Última atualização:</p>
                        <p>maio de 2026</p>
                    </div>
                </div>
                <div className="text-sm text-justify flex flex-col gap-10">
                    <div>
                        <Titulo titulo="1. Compromisso com a Privacidade" />
                        <p>A MetamorphIA trata a privacidade com máxima seriedade, especialmente por lidar com informações de crianças em contexto educacional. Esta Política de Privacidade descreve de forma transparente quais dados são coletados, como são utilizados, por quanto tempo são armazenados e quais são os direitos dos usuários, em conformidade com a <span className="font-bold">Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018)</span>.</p>
                    </div>
                    <div>
                        <Titulo titulo="2. Dados Coletados" />
                        <p>A MetamorphIA coleta apenas os dados estritamente necessários para o funcionamento da plataforma. Os dados são divididos em duas categorias:
                            <br></br><br></br>
                            <span className="font-bold">a) Dados do Professor (titular da conta):</span><br></br>
                            - Nome completo<br></br>
                            - Endereço de e-mail<br></br>
                            - Dados de acesso (login e senha criptografada)
                            <br></br><br></br>
                            <span className="font-bold">b) Dados dos Estudantes (inseridos pelo professor):</span><br></br>
                            - Nome completo do estudante<br></br>
                            - Idade<br></br>
                            - Turma/série<br></br>
                            - Diagnóstico de neurodivergência (se houver e se o professor optar por informar.
                            <br></br><br></br>
                        </p>
                        <p className="italic text-[#797979] ml-20"><span className="font-bold">Nota:</span> A MetamorphIA adota uma abordagem de <span className="font-bold">minimização de dados</span>. Intencionalmente, a plataforma <span className="font-bold">não solicita</span> dados de responsáveis legais (como nome dos pais/responsáveis e contatos telefônicos), reduzindo a exposição de informações sensíveis sem comprometer a utilidade pedagógica da ferramenta.</p>
                    </div>
                    <div>
                        <Titulo titulo="3. Dados Sensíveis" />
                        <p>O diagnóstico de neurodivergência é considerado um <span className="font-bold">dado pessoal sensível</span> nos termos da LGPD (art. 5º, inciso II), pois se enquadra na categoria de dado relativo à saúde. Seu tratamento pela plataforma ocorre com base nas seguintes premissas:
                                <br></br><br></br>
                            - O preenchimento deste campo <span className="font-bold">é opcional</span>;<br></br>
                            - Os dados são utilizados exclusivamente para personalizar as sugestões pedagógicas e o PEI gerado pela IA;<br></br>
                            - Nenhuma informação de diagnóstico é compartilhada com terceiros, utilizada para fins comerciais ou de perfilamento externo.
                        </p>
                    </div>
                    <div>
                        <Titulo titulo="4. Finalidade do Tratamento de Dados" />
                        <p>Os dados coletados são utilizados para:
                                <br></br><br></br>
                            - Autenticação e gestão da conta do professor;<br></br>
                            - Personalização das adaptações pedagógicas sugeridas pela IA;<br></br>
                            - Geração assistida do Plano Educacional Individualizado (PEI);<br></br>
                            - Melhoria contínua dos modelos e funcionalidades da plataforma (de forma anonimizada).
                        </p>
                    </div>
                    <div>
                        <Titulo titulo="5. Base Legal" />
                        <p>O tratamento dos dados pela MetamorphIA fundamenta-se nas seguintes bases legais previstas na LGPD:
                            <br></br><br></br>
                            - <span className="font-bold">Consentimento</span> (art. 7º, inciso I): o professor concede consentimento explícito ao cadastrar informações dos
                            estudantes;<br></br>
                            - <span className="font-bold">Legítimo interesse</span> (art. 7º, inciso IX): para melhoria dos serviços, de forma anonimizada;<br></br>
                            - <span className="font-bold">Execução de contrato</span> (art. 7º, inciso V): para fornecimento das funcionalidades contratadas.
                        </p>
                    </div>
                    <div>
                        <Titulo titulo="6. Compartilhamento de Dados" />
                        <p>A MetamorphIA <span className="font-bold">não vende, aluga ou cede</span> dados pessoais a terceiros. Os dados poderão ser compartilhados apenas nas seguintes situações:
                            <br></br><br></br>
                            - Com prestadores de serviços de infraestrutura tecnológica (como serviços de nuvem), vinculados por contrato à mesma obrigação de sigilo;<br></br>
                            - Quando exigido por determinação legal ou judicial;<br></br>
                            - Com o consentimento expresso do professor responsável pelo cadastro.
                        </p>
                    </div>
                    <div>
                        <Titulo titulo="7. Armazenamento e Segurança" />
                        <p>Os dados são armazenados em servidores com padrões de segurança adequados, incluindo criptografia em trânsito (TLS) e em repouso. A MetamorphIA adota medidas técnicas e organizacionais para proteger as informações contra acesso não autorizado, perda ou destruição.
                            <br></br><br></br>
                            Os dados dos estudantes são <span className="font-bold">vinculados exclusivamente à conta do professor que os cadastrou</span> e não são acessíveis a outros usuários da plataforma.
                        </p>
                    </div>
                    <div>
                        <Titulo titulo="8. Retenção de Dados" />
                        <p>Os dados são mantidos pelo período necessário à prestação do serviço ou enquanto a conta do professor estiver ativa. Após o encerramento da conta, os dados serão anonimizados ou excluídos em até <span className="font-bold">30 (trinta) dias</span>, salvo obrigação legal que exija retenção por período superior.</p>
                    </div>
                    <div>
                        <Titulo titulo="9. Direitos do Usuário" />
                        <p>
                            O professor, como titular dos dados de sua conta, e como responsável pelo cadastro dos dados dos estudantes, pode a qualquer momento:
                            <br></br><br></br>
                            - Acessar os dados armazenados em sua conta;<br></br>
                            - Corrigir informações incorretas ou desatualizadas;<br></br>
                            - Solicitar a exclusão dos dados de um ou mais estudantes;<br></br>
                            - Revogar o consentimento para o tratamento dos dados;<br></br>
                            - Solicitar a portabilidade dos dados;<br></br>
                            - Obter informações sobre o compartilhamento realizado.
                            <br></br><br></br>
                            Para exercer qualquer desses direitos, o usuário pode entrar em contato pelo e-mail indicado na seção 2.11.
                        </p>
                    </div>
                    <div>
                        <Titulo titulo="10. Cookies" />
                        <p>A MetamorphIA utiliza cookies estritamente necessários para o funcionamento da plataforma (autenticação e preferências de sessão). Não são utilizados cookies de rastreamento publicitário ou de terceiros para fins de perfilamento.</p>
                    </div>
                    <div>
                        <Titulo titulo="11. Encarregado pelo Tratamento de Dados" />
                        <p>Em conformidade com o art. 41 da LGPD, a MetamorphIA designa um Encarregado pelo Tratamento de Dados Pessoais, que pode ser contatado pelo e-mail: <span className="font-bold">privacidade@metamorphia.com.br</span></p>
                    </div>
                    <div>
                        <Titulo titulo="12. Alterações nesta Política" />
                        <p>Esta Política de Privacidade pode ser atualizada periodicamente. Alterações relevantes serão comunicadas ao usuário por e-mail ou notificação na plataforma. Recomendamos a revisão periódica deste documento.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}