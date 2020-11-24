# Clips

[getclips.app](https://getclips.app)

Proof of concept, macOS menubar app & site for storing and sharing interesting finds from the Internet.
        
<br/>

<p align="center">
  <img width="600" src="https://user-images.githubusercontent.com/12195101/99995861-d8643e00-2d6f-11eb-81e0-e70f76740c41.gif" />
</p>

Clips is a [Next.js](https://nextjs.org/) app deployed on [Vercel](https://vercel.com). It's sitting on top of a MongoDB instance, uses [swr](swr.vercel.app) for data fetching and caching, [emotion](https://emotion.sh/docs/introduction) for styling, and basic cookie authentication under the hood. The menubar repository can be found [here](https://github.com/timc1/clips-menubar). More details about the project can be found on this [post](https://timcchang.com/clips).

### Setup

I enjoy building things – tinkering with new technologies, dabbling with design, and making things from ideation to launch. Clips is another culmination of my curiosity and the project that I've been experimenting with over the past few months. Clips is completely open – feel free to play with the hosted version on [getclips.app](https://getclips.app) or run your own instance/learn/build on top of it.

Clips is sitting on top of a MongoDB instance, uses reCAPTCHA, S3 for hosting images, and Sendgrid for emails. You'll want to grab the relevant keys for these services. The great thing is we can run this all for free!

Postel uses `yarn` to manage dependencies – let's get started:

1. First we'll want to clone the repo – run `git clone git@github.com:timc1/clips.git`

2. Update `.env.example` to `.env.local`. This is where we'll store all keys for development. 

3. Setup a MongoDB account and DB [here](https://www.mongodb.com/try). Follow the instructions to create a new collection and grab the uri to connect to the database. Copy the uri into the `MONGO_URI` portion of the `.env`.

4. Setup a Sendgrid account [here](https://signup.sendgrid.com/). Follow the instructions to send basic emails and copy the api key in `SENDGRID_API_KEY`

5. Setup an IAM user with S3 access on your AWS account, and copy the access key id & secret access key in the `.env` as well. Setup 2 buckets and update [these](https://github.com/timc1/clips/blob/main/lib/constants.ts#L33-L34) constants to reflect them.

6. Setup reCAPTCHA [here](https://www.google.com/recaptcha/admin) and copy the key into `.env`.

7. Set a password for your session cookie – read more about it [here](https://github.com/vvo/next-iron-session).

8. Add a [uuid](https://www.uuidgenerator.net/) to the JWT key.

Okay phew, done!

Run `yarn install` to download dependencies.

Then `yarn start` to get your local server running.

Since we're deploying on Vercel, make sure to edit the contents of [`now.json`](https://github.com/timc1/clips/blob/main/now.json) with your own unique keys. Using the Vercel CLI you can just run `vercel secrets add mongo-uri <KEY_HERE>` for each of the keys.

### Testing

TODO – should've built tests incrementally but here we are. [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro/) would be rad.

Got questions? Feel free to email me timchang@hey.com or shoot me a DM [@timcchang](https://twitter.com/timcchang)!
