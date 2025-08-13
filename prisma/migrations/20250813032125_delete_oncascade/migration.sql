-- DropForeignKey
ALTER TABLE "agenda" DROP CONSTRAINT "agenda_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "agenda" DROP CONSTRAINT "agenda_profissionalId_fkey";

-- DropForeignKey
ALTER TABLE "consulta" DROP CONSTRAINT "consulta_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "consulta" DROP CONSTRAINT "consulta_profissionalId_fkey";

-- DropForeignKey
ALTER TABLE "consulta" DROP CONSTRAINT "consulta_unidadeId_fkey";

-- DropForeignKey
ALTER TABLE "internacao" DROP CONSTRAINT "internacao_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "internacao" DROP CONSTRAINT "internacao_unidadeId_fkey";

-- DropForeignKey
ALTER TABLE "paciente" DROP CONSTRAINT "paciente_unidadeId_fkey";

-- DropForeignKey
ALTER TABLE "prescricao" DROP CONSTRAINT "prescricao_prontuarioId_fkey";

-- DropForeignKey
ALTER TABLE "profissional" DROP CONSTRAINT "profissional_unidadeId_fkey";

-- DropForeignKey
ALTER TABLE "prontuario" DROP CONSTRAINT "prontuario_consultaId_fkey";

-- DropForeignKey
ALTER TABLE "prontuario" DROP CONSTRAINT "prontuario_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "prontuario" DROP CONSTRAINT "prontuario_profissionalId_fkey";

-- DropForeignKey
ALTER TABLE "telemedicina" DROP CONSTRAINT "telemedicina_consultaId_fkey";

-- AddForeignKey
ALTER TABLE "paciente" ADD CONSTRAINT "paciente_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profissional" ADD CONSTRAINT "profissional_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agenda" ADD CONSTRAINT "agenda_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agenda" ADD CONSTRAINT "agenda_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "profissional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consulta" ADD CONSTRAINT "consulta_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consulta" ADD CONSTRAINT "consulta_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "profissional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consulta" ADD CONSTRAINT "consulta_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telemedicina" ADD CONSTRAINT "telemedicina_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "consulta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prontuario" ADD CONSTRAINT "prontuario_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "consulta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prontuario" ADD CONSTRAINT "prontuario_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prontuario" ADD CONSTRAINT "prontuario_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "profissional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescricao" ADD CONSTRAINT "prescricao_prontuarioId_fkey" FOREIGN KEY ("prontuarioId") REFERENCES "prontuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internacao" ADD CONSTRAINT "internacao_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internacao" ADD CONSTRAINT "internacao_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
