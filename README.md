# PizzaNomics

<img width="1425" alt="Screenshot 2024-12-12 at 12 42 28 PM" src="https://github.com/user-attachments/assets/9f27b6c9-a694-4dd7-a4f1-cba8c9454094" />

## Table of Contents
- [Link to deployed application](#link-to-deployed-application)
- [Description](#description)
- [Technologies](#technologies)
- [Testing](#testing)
- [Future development](#future-development)
- [More screenshots](#more-screenshots)

## Link to deployed application

https://pizzanomics.vercel.app

## Description

Pizzanomics is a full stack web application that allows owners and chefs of a fictional pizzeria to track their inventory of pizzas as well as their ingredients. This project is a standard CRUD application that draws inspiration from other popular pizza order applications such as Pizza Hut, Papa John's, and Grimaldi's.

## Technologies

- Next.js: This was chosen as the framework for the project based on the personal familiarity of the framework as well as the fact that Next.js supports server-side rendering which increases the performance of the application for simple data fetching. Next.js also supports client side rendering to make form data easily passed from client to server.

- Tailwind CSS: The design framework used for this project. Allows for easy customization of the design of certain pages and components.

- Supabase: Initially, the project was going to be built with sqlite as a super lightweight database and would be stored server-side. However, after some research, it was decided to switch to supabase as sqlite presented some issues when deploying to popular hosting providers such as Vercel and Heroku. Supabase is a great, reliable, free hosting option that pairs well with Next.js, Prisma and PostgreSQL.

- Prisma: Prisma is a database ORM that allows for easy data fetching and manipulation. Regardless of the database used for the project, Prisma provides a consistent API for interacting with the database.

- PostgreSQL: PostgreSQL is a powerful, open-source relational database management system. It is known for its reliability, scalability, and performance.

- ShadCN component library: A personal favorite for fast building and ease of component use. Its modern feel and constant additions of features make it my go-to for building applications.

- JEST: A testing framework that is used for unit testing and integration testing.

- Vercel Hosting: The project was deployed to Vercel for easy hosting and deployment. Vercel is a 'serveless' hosting provider (essentially an AWS wrapper) that allows for easy deployment and hosting of Next.js applications. While it is 'serverless' that doesn't mean there is no server, it just means that teh developer doesn't have to worry about managing the server.

- Vercel OG: Allows for ease of creating URL cards for the project which can be shared on social media which add another element of branding to the project.

- JSON web tokens: Allow for authentication and the JWTs are signed and coded as well as exist in HTTP only cookies for protection and authentication.

## Testing

The projects main operations are the ability for a chef to CREATE, READ, UPDATE, and DELETE pizzas as well as the ability for an owner to CREATE, READ, UPDATE, and DELETE ingredients. The main testing framework used is JEST and each one of these CRUD operations as well as user Authentication are tested individually. While using a test database was considered for this project, it was ultimately decided to just test against specific functionality using mocks for prisma functions and expected results rather than creating a separate test database. On bigger projects and companies I would absolutely suggest to have an entirely separate test database, test site, etc. to make sure only proper running code is executed in production.

This project is also protected by Github's rulesets and those rules can be found in the tests.yml file. These tests must pass for a PR to go through.

- Node V 16 or greater required.

1. Fork this project
2. Clone the forked project to your local machine
3. Run `npm install` to install all the dependencies
4. Create a `.env` file in the root directory of the project and add the variables from template.env (populate them with actual values)
5. Run `npm run test` to run the tests (inside your github repo you will also need a `JWT_SECRET` that will be used for authentication testing)
6. Run `npm run dev` to start the application

## Future Development

The sky is truly the limit for this project and there were many features that I wanted to add to the project including:

1. A chef/owner dashboard which allows for chefs and owners to view their inventory in a more database related manner.
2. A chef/owner settings page which allows for the owner or chef to update their profile information, password and delete their account.
3. Sorting and filtering if the database became too crowded with pizzas and toppings. I chose to use horizontal for the time being as I predict there won't be too many pizzas or toppings added.
4. Google authentication for ease of sign ups and log in.
5. Separate actual db from test db and run actual tests to the test database.

## More Screenshots

<img width="1423" alt="Screenshot 2024-12-12 at 12 43 24 PM" src="https://github.com/user-attachments/assets/8770aaa9-fd72-4f62-9b97-a7afd8a74e5a" />
<img width="1376" alt="Screenshot 2024-12-12 at 12 44 02 PM" src="https://github.com/user-attachments/assets/68cee12e-6796-4eaa-82e5-329341628bd6" />
<img width="1422" alt="Screenshot 2024-12-12 at 12 44 44 PM" src="https://github.com/user-attachments/assets/fc168568-3901-4ebf-9720-cedcd89b37ba" />


