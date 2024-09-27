export class PasswordVerificationError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'PasswordVerificationError'
	}
}
