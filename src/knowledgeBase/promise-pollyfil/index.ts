/*
1. отрабатывают then, возвращают новый промис + пуш в промис, от которого вызываются, колбэка,
 который имеют и resolve'а, который будет запускать функцию resolve, нового промиса, который будет
 иметь доступ уже к следущему колбэку и так по цепочке

2. 
	проходит таймаут и запускается первый resolve с аргументом sleep(500).
	sleep - функция, которая возвращает промис, у него есть таймаут, соответсвенно,
	в первый resolve прилетит промис со статусом pending.

3.
	т.к в функцию resolve прилетел промис, он попал в тайпгард.
	в тайпгарде вызывается then этого промиса с аргументом this.resolve.
	then пушит в массив этого промиса resolve прошлого и следующего.
	this.resolve будет запускать рекурсию, после окочания таймаута.
	Т.е тайпгард позволяет отложить запуск рекурсии, запушить старый resolve, который имеет уже колбэк 
	в массиве, и как только таймаут пройдет, случится resolve, который запустит старый resolve 
	как только таймаут пройдет запустится 

4. проходит 2 секунды, отрабатывает resolve этого промиса, который был со статусом пендинг, с аргументом 5.
выполняется фунуция resolve, которая вызывается как thenCb, чтобы как раз запустить рекурсию, которая
уже будет исполняться как и ранее.

SUMMARY:

тайпгард позволяет нам подождать resolv'а пендинг промиса и запустить повторно первый resolve, который 
уже получает аргумент в виде примитива и запускает рекурсию функций resolve, который будут вызываться
каждый раз в разном контексте, что позволит пользоваться колбэками, которые пушатся на ините
*/

export const PromisePollyfil = () => {
	type Initializer<T> = (resolve: Resolve<T>, reject: Reject) => void

	type AnyFunc = (...args: any[]) => any
	type Resolve<T> = (value: T) => void
	type Reject = (reason?: any) => void
	type Status = 'fulfilled' | 'rejected' | 'pending'

	class MyPromise<T> {
		thenCbs: [AnyFunc, Resolve<T>][] = []
		catchCbs: [AnyFunc, Reject][] = []
		status: Status = 'pending'

		constructor(initializer: Initializer<T>) {
			initializer(this.resolve, this.reject)
		}

		then = (thenCb: AnyFunc) => {
			return new MyPromise((resolve, reject) => {
				this.thenCbs.push([thenCb, resolve])
			})
		}

		catch = (catchCb: AnyFunc) => {
			return new MyPromise((resolve, reject) => {
				this.catchCbs.push([catchCb, reject])
			})
		}

		private resolve = (value: T | PromiseLike<T>) => {
			if (isPromiseLike(value)) {
				value.then(this.resolve, this.reject)
			} else {
				this.status = 'fulfilled'
				this.processNextTask(value)
			}
		}

		private reject = () => {}

		private processNextTask = (value: T | PromiseLike<T>) => {
			if (this.status === 'pending') return

			if (this.status === 'fulfilled') {
				const thenCbs = this.thenCbs
				this.thenCbs = []

				thenCbs.forEach(([thenCb, resolve]) => {
					const nextValue = thenCb(value)
					resolve(nextValue)
				})
			} else {
			}
		}
	}

	const sleep = <T>(ms: number) => {
		return new MyPromise<number>(res => {
			setTimeout(() => {
				res(5)
			}, ms)
		})
	}

	const promise = new MyPromise((resolve, reject) => {
		setTimeout(() => {
			resolve(sleep(2000))
		}, 1000)
	})
		.then(value => {
			console.log(value)
			return value + 5
		})
		.then(value => console.log(value))

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
