# LingoLeap 

## Ideation

Develop therapy material in Hindi for misarticulation children.

Our project **helps children with misarticulation**, by providing a platform that **integrates speech recognition** for precise pronunciation, accessibility improvements, and the **provision of therapy resources in Hindi** via **gamified language** acquisition thereby encouraging participation and steady development throughout their speech therapy process.

Link for the presentation: - [Click here](https://www.canva.com/design/DAF46kiPCxw/AnhzPyR1pIgxE3TdFUDAeg/view?utm_content=DAF46kiPCxw&utm_campaign=designshare&utm_medium=link&utm_source=editor)

## Objective 

Web App helping children in Hindi-speaking communities enhance their speech articulation skills while enjoying their learning journey.

## Getting Started

First, run the web application using nextjs and nodejs separately on different command prompts:

```
nextjs ->
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

nodejs ->
cd Backend
# and
npm start
```
**npm install** to get all the packages on nextjs and nodejs command prompmt separately.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a **.env** file in both Nextjs folder and Nodejs folder

- Nextjs folder .env :
  1. MONGO_URI = _Your mongodb path_
  2. TOKEN_SECRET = _Your secret token_
  3. DOMAIN = http://localhost:3000
- Nodejs folder .env:
  1. MONGO_URI = _Your mongodb path_
  2. JWT_SECRET = _Your secret token_
  3. JWT_LIFETIME = _Expiry time of JWT_
  4. DOMAIN = http://localhost:5000
