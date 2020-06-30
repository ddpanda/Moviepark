import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async register ({ auth, request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      username: schema.string({ trim: true }, [
        rules.minLength(3),
        rules.maxLength(20),
        rules.required(),
        rules.unique({ table: 'users', column: 'username' }),
      ]),
      password: schema.string({ trim: true }, [
        rules.minLength(5),
        rules.required(),
        rules.confirmed(),
      ]),
    })

    const userDetails = await request.validate({
      schema: validationSchema,
    })

    const user = new User()
    user.username = userDetails.username
    user.password = userDetails.password
    await user.save()

    await auth.login(user)
    return response.created({status:201, message:'User created & logged', user: { username: user.username }})
  }

  public async login ({ auth, request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      username: schema.string({ trim: true }, [
        rules.required(),
      ]),
      password: schema.string({ trim: true }, [
        rules.required(),
      ]),
      remember_me: schema.boolean(),
    })

    const userDetails = await request.validate({
      schema: validationSchema,
    })

    const user = await auth.attempt(userDetails.username, userDetails.password, userDetails.remember_me)
    return response.accepted({status:202, message:'User logged', user: { username: user.username }})
  }

  public async logout ({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.created({status:200, message:'User logged out'})
  }

  public async check ({ auth, response }: HttpContextContract) {
    try{
      const user = await auth.authenticate()
      return response.accepted({status:202, message:'User authenticated', user: { username: user.username }})
    } catch {
      return response.ok({status:204, message:'User not found', user: undefined})
    }
  }
}
