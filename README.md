# PizzaNomics

## Link to deployed application

https://pizzanomics.vercel.app

## Description

Pizzanomics is a web application that allows owners and chefs of a fictional pizzeria to track their inventory of pizzas as well as their ingredients. This project is a standard CRUD application that draws inspiration from other popular pizza order applications such as Pizza Hut, Papa John's, and Grimaldi's.

## Technologies

- Next.js: This was chosen as the framework for the project based on the personal familiarity of the framework as well as the fact that Next.js supports server-side rendering which increases the performance of the application for simple data fetching.

- Tailwind CSS: The design framework used for this project. Allows for easy customization of the design of certain pages and components.

- Supabase: Initially, the project was going to be built with sqlite as a super lightweight database and would be stored server-side. However, after some research, it was decided to switch to supabase as sqlite presented some issues when deploying to popular hosting providers such as Vercel and Heroku. Supabase is a great, reliable, free hosting option that pairs well with Next.js, Prisma and PostgreSQL.

- Prisma: Prisma is a database ORM that allows for easy data fetching and manipulation. Regardless of the database used for the project, Prisma provides a consistent API for interacting with the database.

- PostgreSQL: PostgreSQL is a powerful, open-source relational database management system. It is known for its reliability, scalability, and performance.

- ShadCN component library: A personal favorite for fast building and ease of component use. Its modern feel and constant additions of features make it my go-to for building applications.

- JEST: A testing framework that is used for unit testing and integration testing.

- Vercel Hosting: The project was deployed to Vercel for easy hosting and deployment. Vercel is a 'serveless' hosting provider (essentially an AWS wrapper) that allows for easy deployment and hosting of Next.js applications. While it is 'serverless' that doesn't mean there is no server, it just means that teh developer doesn't have to worry about managing the server.

- Vercel OG: Allows for ease of creating URL cards for the project which can be shared on social media which add another element of branding to the project.

## Testing and forking details

The projects main operations are the ability for an owner to CREATE, READ, UPDATE, and DELETE pizzas as well as the ability for a chef to CREATE, READ, UPDATE, and DELETE ingredients. The main testing framework used is JEST and each one of these CRUD operations as well as user Authentication are tested individually. Fork this project and add your own features and functionality.

1. Fork this project
2. Clone the forked project to your local machine
3. Run `npm install` to install all the dependencies
4. Create a `.env` file in the root directory of the project and add the variables from template.env
5. Run 'npm run test' to run the tests
6. Run 'npm run dev' to start the application

## Future Development

The sky is truly the limit for this project and there were many features that I wanted to add to the project including:

1. A chef/owner dashboard which allows for chefs and owners to view their inventory in a more database related manner.
2. A chef/owner settings page which allows for the owner or chef to update their profile information, password and delete their account.
