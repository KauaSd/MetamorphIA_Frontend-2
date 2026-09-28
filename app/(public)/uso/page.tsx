import Titulo from "@/components/public/TituloTermos";

export default function Uso(){
    return(
        <div className="flex justify-center items-center text-[#433F3F] mt-20">
            <div className="bg-[#FFFDFA] w-800 h-auto p-10 rounded-[70px] flex flex-col gap-10">
                <div className="flex flex-col gap-1">
                    <p className="font-(family-name:--font-text-me-one) text-3xl">Termos de Serviço</p>
                    <div className="flex flex-row gap-1 text-[#797979] text-sm items-center">
                        <p className="font-bold">Última atualização:</p>
                        <p>maio de 2026</p>
                    </div>
                </div>
                <div className="text-sm text-justify flex flex-col gap-10">
                    <div>
                        <Titulo titulo="1. Sobre a Plataforma" />
                        <p>Bem-vindo(a) à <span className="font-bold">MetamorphIA</span>, uma plataforma educacional desenvolvida para auxiliar professores dos anos iniciais do Ensino Fundamental na adaptação de atividades pedagógicas para estudantes neurodivergentes, com o suporte de um agente de inteligência artificial. Ao utilizar o MetamorphIA, você concorda integralmente com os presentes Termos de Serviço. Caso não concorde com alguma das condições aqui descritas, solicitamos que não prossiga com o uso da plataforma.</p>
                    </div>
                    <div>
                        <Titulo titulo="2. Público-Alvo e Elegibilidade" />
                        <p>A MetamorphIA é destinado exclusivamente a <span className="font-bold">professores e profissionais da educação</span> atuantes nos anos iniciais do Ensino Fundamental (1º ao 5º ano). O acesso à plataforma é vedado a menores de 18 anos de forma autônoma. O uso em contexto institucional (escolas públicas ou privadas) é permitido e incentivado, desde que em conformidade com as políticas internas da instituição.</p>
                    </div>
                    <div>
                        <Titulo titulo="3. Funcionalidades Disponíveis" />
                        <p>A plataforma oferece, entre outras, as seguintes funcionalidades:
                            <br></br><br></br>
                            - <span className="font-bold">Adaptação de atividades pedagógicas:</span> o professor pode inserir uma atividade existente e, com o auxílio do agente de IA, receber sugestões de adaptação conforme o perfil de neurodivergência do estudante.<br></br>
                            - <span className="font-bold">Geração assistida do Plano Educacional Individualizado (PEI):</span> a partir das informações fornecidas pelo  professor sobre o estudante, o agente de IA auxilia no preenchimento parcial do PEI, reduzindo a carga  burocrática do processo.<br></br>
                            - <span className="font-bold">Perfil do estudante:</span> o professor pode cadastrar informações relevantes sobre cada aluno para personalizar as sugestões geradas pela IA.
                            <br></br><br></br>
                        </p>
                        <p className="italic text-[#797979] ml-20"><span className="font-bold">Importante:</span> A MetamorphIA é uma ferramenta de <span className="font-bold">apoio pedagógico</span>, não substituindo o julgamento profissional do professor, de psicopedagogos, psicólogos ou demais especialistas envolvidos no  acompanhamento do estudante. Os documentos gerados pela plataforma devem ser revisados pelo   profissional responsável antes de qualquer uso formal.</p>
                    </div>
                    <div>
                        <Titulo titulo="4. Responsabilidades do Usuário" />
                        <p>Ao utilizar o MetamorphIA, o professor se compromete a:
                            <br></br><br></br>
                            - Fornecer informações verdadeiras, precisas e atualizadas sobre os estudantes cadastrados;<br></br>
                            - Utilizar a plataforma exclusivamente para fins pedagógicos legítimos;<br></br>
                            - Não compartilhar suas credenciais de acesso com terceiros;<br></br>
                            - Não inserir dados além dos estritamente necessários para o funcionamento das funcionalidades;<br></br>
                            - Revisar e validar todo o conteúdo gerado pela IA antes de utilizá-lo em contexto escolar formal;<br></br>
                            - Zelar pelo uso ético e responsável das informações dos estudantes, respeitando sua dignidade e privacidade.
                        </p>
                    </div>
                    <div>
                        <Titulo titulo="5. Limitações e Isenção de Responsabilidade" />
                        <p> A MetamorphIA emprega tecnologia de inteligência artificial, cujas respostas e sugestões possuem caráter <span className="font-bold">orientativo e não definitivo</span>. A plataforma não se responsabiliza por:
                            <br></br><br></br>
                            - Decisões pedagógicas tomadas exclusivamente com base no conteúdo gerado pela IA;<br></br>
                            - Resultados educacionais dos estudantes;<br></br>
                            - Uso indevido das informações por parte do usuário;<br></br>
                            - Falhas de conectividade ou indisponibilidade temporária do serviço.
                        </p>
                    </div>
                    <div>
                        <Titulo titulo="6. Propriedade Intelectual" />
                        <p>Todo o conteúdo da plataforma — incluindo interface, marca, logotipo, código-fonte e modelos de IA — é de propriedade exclusiva do MetamorphIA e está protegido pelas leis de propriedade intelectual vigentes no Brasil. O conteúdo gerado pela IA a partir das interações do usuário pode ser utilizado livremente pelo professor para fins pedagógicos, sendo vedada sua comercialização ou redistribuição sem autorização prévia.
                        </p>
                    </div>
                    <div>
                        <Titulo titulo="7. Alterações nos Termos" />
                        <p>A MetamorphIA se reserva o direito de atualizar estes Termos de Serviço a qualquer momento. Alterações relevantes serão comunicadas ao usuário por e-mail ou por notificação dentro da própria plataforma, com antecedência mínima de 15 (quinze) dias. O uso continuado da plataforma após a vigência das alterações implica a aceitação dos novos termos.
                        </p>
                    </div>
                    <div>
                        <Titulo titulo="8. Disposições Finais" />
                        <p>Estes Termos de Serviço são regidos pelas leis da República Federativa do Brasil. Eventuais disputas serão submetidas ao foro da comarca de domicílio do usuário, conforme previsto no Código de Defesa do Consumidor (Lei nº 8.078/1990).</p>
                    </div>
                </div>
            </div>
        </div>
    )
}