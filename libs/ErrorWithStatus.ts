// Кастомная ошибка с кодом статуса
export class ErrorWithStatus extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ErrorWithStatus';
    this.status = status;
  }
}
