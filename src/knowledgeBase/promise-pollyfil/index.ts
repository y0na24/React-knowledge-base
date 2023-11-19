//методы then и catch возвращают новые промисы

type Initializer<T> = (resolve: Resolve<T>, reject: Reject) => void

type AnyFunc = (...args: any[]) => any
type Resolve<T> = (value: T) => void
type Reject = (reason?: any) => void
type Status = 'fulfilled' | 'rejected' | 'pending'

class MyPromise<T> {
	thenCbs: [AnyFunc, Resolve<T>][] = []
	catchCbs: [AnyFunc, Reject][] = []
	status: Status = 'pending'
	value: T | null = null
	err?: any = null

	constructor(initializer: Initializer<T>) {
		initializer(this.resolve, this.reject)
	}

	then = (thenCb: (value: T) => void) => {
		return new MyPromise((resolve, reject) => {
			this.thenCbs.push([thenCb, resolve])
		})
	}

	catch = (catchCb: (reason?: any) => void) => {
		return new MyPromise((resolve, reject) => {
			this.catchCbs.push([catchCb, reject])
		})
	}

	private resolve = (value: T) => {
		this.status = 'fulfilled'
		this.value = value

		this.processNextTask()
	}

	private reject = (reason?: any) => {
		this.status = 'rejected'
		this.err = reason

		this.processNextTask()
	}

	private processNextTask = () => {
		if (this.status === 'pending') return

		if (this.status === 'fulfilled') {
			const thenCbs = this.thenCbs
			this.thenCbs = []

			thenCbs.forEach(([thenCb, resolve]) => {
				const value = thenCb(this.value)
				resolve(value)
			})
		} else {
		}
	}
}

const sleep = <T>(ms: number, value: any) => {
	return new Promise<void>(res => {
		setTimeout(() => {
			res(value)
		}, ms)
	})
}

const promise = new MyPromise<number>((resolve, reject) => {
	setTimeout(() => {
		resolve(10)
	}, 1000)
})
	.then(value => {
		console.log(value)
		return 5
	})
	.then(value => console.log(value))
	.catch(err => console.log(err))

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
