# SoratHeasb Invoice Management System Backend

This is a simple Node.js application for managing invoices. It provides basic CRUD (Create, Read, Update, Delete) operations and uses a JSON file as the database. This README will guide you on how to set up and use the application.

## Features

-   Create new invoices
-   Read all invoices
-   Update existing invoices
-   Delete invoices

## Prerequisites

-   Node.js installed on your machine

## Getting Started

1. Clone this repository to your local machine:

    ```bash
    git https://github.com/Mahdi-Hazrati/SoratHesab.git
    cd SoratHesab/backend
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Start the application:

    ```bash
    npm start
    ```

    The server will start running on the default port 3000. You can change the port by setting the `PORT` environment variable.

## Usage

### Create a New Invoice

Send a POST request to `/invoices` with the following JSON format:

```json
{
    "invoice_number": "156656416",
    "invoice_date": "1402/02/12",
    "customer_name": "مهدی حضرتی",
    "invoice_amount": "1,800,000,000",
    "invoice_type": "همکاری",
    "transportation": "نقدی",
    "address": "تهران",
    "customers_full_name": "مهدی حضرتی"
}
```

### Read All Invoices

Send a GET request to `/invoices` to retrieve a list of all invoices.

### Update an Existing Invoice

Send a PUT request to `/invoices/:id` with the invoice ID and the updated invoice data in the request body:

```json
{
    "invoice_number": "156656416",
    "invoice_date": "1402/02/12",
    "customer_name": "مهدی حضرتی",
    "invoice_amount": "1,800,000,000",
    "invoice_type": "همکاری",
    "transportation": "نقدی",
    "address": "تهران",
    "customers_full_name": "مهدی حضرتی"
}
```

### Delete an Invoice

Send a DELETE request to `/invoices/:id` to delete a specific invoice by ID.

## Database

The application uses a JSON file (`invoices.json`) as the database to store invoice data. You can find this file in the `src/database` directory.

## Error Handling

The application includes basic error handling. It returns appropriate status codes and error messages when issues occur.

## Contributing

Contributions are welcome. Please follow the standard GitHub flow:

1. Fork the repository.
2. Create a branch (e.g., `feature/new-feature` or `fix/issue-fix`).
3. Make your changes and commit them.
4. Push to your forked repository.
5. Create a pull request to the main repository's `main` branch.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

-   Special thanks to [Node.js](https://nodejs.org/) and [Express.js](https://expressjs.com/) for the core of this application.
