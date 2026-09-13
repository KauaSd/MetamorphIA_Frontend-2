import Titulo from "@/components/TituloTermos";

export default function Privacidade(){
    return(
        <div className="flex justify-center items-center text-[#433F3F]">
            <div className="bg-[#FFFDFA] w-800 h-auto p-10 rounded-[70px]">
                <div>
                    <p className="font-(family-name:--font-text-me-one) text-3xl">Política de Privacidade</p>
                    <div className="flex flex-row gap-1 text-[#797979] text-sm items-center">
                        <p className="font-bold">Última atualização:</p>
                        <p>maio de 2026</p>
                    </div>
                </div>
                <div className="text-sm text-justify">
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
                            - Dados de acesso (login e senha criptografada)<br></br>
                            <br></br><br></br>
                            <span className="font-bold">b) Dados dos Estudantes (inseridos pelo professor):</span><br></br>
                            - Nome completo do estudante<br></br>
                            - Idade<br></br>
                            - Turma/série<br></br>
                            - Diagnóstico de neurodivergência (se houver e se o professor optar por informar.
                        </p>
                        <p className="italic text-[#797979]"><span className="text-bold">Nota:</span> A MetamorphIA adota uma abordagem de <span className="font-bold">minimização de dados</span>. Intencionalmente, a plataforma <span className="text-bold">não solicita</span> dados de responsáveis legais (como nome dos pais/responsáveis e contatos telefônicos), reduzindo a exposição de informações sensíveis sem comprometer a utilidade pedagógica da ferramenta.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}