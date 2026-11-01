export class MailDeliveryError extends Error {
  constructor(
    readonly status: number,
    readonly reason: string
  ) {
    super(`Mail delivery failed (${status}): ${reason}`);
    this.name = "MailDeliveryError";
  }
}
