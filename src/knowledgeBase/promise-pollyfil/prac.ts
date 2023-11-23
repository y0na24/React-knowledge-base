import { asap, isPromiseLike } from './utils'

/*
SUMMARY о проверке в методе resolve на PromiseLike:

тайпгард позволяет нам подождать resolv'а пендинг промиса и запустить повторно первый resolve, который 
уже получает аргумент в виде примитива и запускает рекурсию функций resolve, который будут вызываться
каждый раз в разном контексте, что позволит пользоваться колбэками, которые пушатся на ините

SUMMARY о создании проверки есть ли коллбэк:


*/

export const PromisePollyfil = () => {
	type Initializer<T> = (resolve: Resolve<T>, reject: Reject) => void

	type AnyFunc = (...args: any[]) => any
	type Resolve<T> = (value: T) => void
	type Reject = (reason?: any) => void
	type Status = 'fulfilled' | 'rejected' | 'pending'

	class MyPromise<T> {
		thenCbs: [AnyFunc | undefined, AnyFunc | undefined, Resolve<T>, Reject][] =
			[]
		value: T | undefined = undefined
		err: any | undefined = undefined
		status: Status = 'pending'

		constructor(intializer: Initializer<T>) {
			intializer(this.resolve, this.reject)
		}

		static all<T>(promises: MyPromise<T>[]) {
			const result = Array(promises.length)
			let count = 0

			return new MyPromise((resolve, reject) => {
				promises.forEach((p, index) => {
					p.then(value => {
						result[index] = value
						count++

						if (count === promises.length) {
							resolve(result)
						}
					}).catch(err => reject(err))
				})
			})
		}

		static allSettled<T>(promises: MyPromise<T>[]) {
			return MyPromise.all(
				promises.map(p =>
					p
						.then(value => ({ status: 'fulfilled', value }))
						.catch(reason => ({ status: 'rejected', reason }))
				)
			)
		}

		static race<T>(promises: MyPromise<T>[]) {
			return new MyPromise((resolve, reject) => {
				promises.forEach(p => {
					p.then(resolve).catch(reject)
				})
			})
		}

		static resolve<T>(value: T) {
			return new MyPromise(resolve => {
				resolve(value)
			})
		}

		static reject<T>(reason: T) {
			return new MyPromise(reject => {
				reject(reason)
			})
		}

		then = (thenCb: AnyFunc, catchCb?: AnyFunc) => {
			const promise = new MyPromise((resolve, reject) => {
				this.thenCbs.push([thenCb, catchCb, resolve, reject])
			})

			this.processNestTask()

			return promise
		}

		catch = (catchCb: AnyFunc) => {
			const promise = new MyPromise((resolve, reject) => {
				this.thenCbs.push([undefined, catchCb, resolve, reject])
			})

			this.processNestTask()

			return promise
		}

		private resolve = (value: T | PromiseLike<T>) => {
			if (isPromiseLike(value)) {
				value.then(this.resolve, this.reject)
			} else {
				this.status = 'fulfilled'
				this.value = value

				this.processNestTask()
			}
		}

		private reject = (reason: any) => {
			this.status = 'rejected'
			this.err = reason

			this.processNestTask()
		}

		private processNestTask = () => {
			queueMicrotask(() => {
				if (this.status === 'pending') return

				const thenCbs = this.thenCbs
				this.thenCbs = []

				thenCbs.forEach(([thenCb, catchCb, resolve, reject]) => {
					try {
						if (this.status === 'fulfilled') {
							const nextValue = thenCb ? thenCb(this.value) : this.value
							resolve(nextValue)
						} else {
							if (catchCb) {
								resolve(catchCb(this.err))
							} else {
								reject(this.err)
							}
						}
					} catch (err) {
						reject(err)
					}
				})
			})
		}
	}

	const promise = new MyPromise((resolve, reject) => {
		resolve(5)
	})
		.then(value => {
			console.log(value)

			throw new Error('error')
		})
		.then(() => {
			console.log('asdfasdfsdaf')
		})
		.then(() => {
			console.log('test')
		})
		.catch(err => {
			console.error('=====', err)
		})
		.then(() => {
			return new MyPromise((resolve, reject) => {
				resolve(5)
			})
		})
		.then(console.log)

	return null
}

// const promise = new Promise((resolve, reject) => {
// 	setTimeout(() => {
// 		resolve(5)
// 	}, 500)
// })
// 	.then(value => {
// 		console.log('sleep')
// 		return sleep(5000)
// 	})
// 	.then(value => {
// 		console.log('--------------')
// 	})
// 	.catch(err => {
// 		console.log(err)
// 	})

// const promise = new MyPromise((resolve, reject) => {
// 	setTimeout(() => {
// 		resolve(5)
// 	}, 1000)
// })
// 	.then(value => {
//     console.log('sleep')
// 		return sleep(5000)
// 	})
// 	.then(value => {
// 		console.log('--------------')
// 	})
// 	.catch(err => {
// 		console.log(err)
// 	})
