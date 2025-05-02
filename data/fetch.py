#!/usr/bin/env uv run
import requests
import json


def fetch_products():
    url = "https://backbone-web-api.production.regensburg.delcom.nl/products?join=translations"
    response = requests.get(url)
    if response.status_code == 200:
        products = response.json()
        with open("products.json", "w") as f:
            json.dump(products, f, indent=4)
        print("Products fetched successfully.")
    else:
        print(f"Failed to fetch products. Status code: {response.status_code}")


def fetch_bookings():
    url = "https://backbone-web-api.production.regensburg.delcom.nl/bookings?join=supervisors"
    response = requests.get(url)
    if response.status_code == 200:
        bookings = response.json()
        with open("bookings.json", "w") as f:
            json.dump(bookings, f, indent=4)
        print("Bookings fetched successfully.")
    else:
        print(f"Failed to fetch bookings. Status code: {response.status_code}")


def main():
    fetch_products()
    fetch_bookings()


if __name__ == "__main__":
    main()
