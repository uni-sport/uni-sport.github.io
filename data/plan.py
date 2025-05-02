#!/usr/bin/env uv run
import json
from ruamel.yaml import YAML
from ruamel.yaml.scalarstring import DoubleQuotedScalarString

import re
from dateutil import parser
from datetime import timedelta
import pytz
import textwrap

yaml = YAML(typ="rt")

weekdays = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
]


def create_schedules(calendar):
    holidays = calendar["holidays"]
    schedules = []
    for i in range(0, 7):
        dates = []
        current_date = calendar["start"] + timedelta(days=i)
        while current_date <= calendar["end"]:
            if current_date not in holidays:
                dates.append(current_date)
            current_date += timedelta(days=7)
        schedules.append(set(dates))
    return schedules


def parse_dates(booking, schedules):
    dates = booking["dates"]
    dates.sort()
    date_set = set(booking["dates"])

    best_diff = 1000000
    best_schedule = schedules[0]
    for schedule in schedules:
        diff = len(date_set.symmetric_difference(schedule))
        if diff < best_diff:
            best_diff = diff
            best_schedule = schedule.copy()

    additions = date_set - best_schedule
    if best_diff < len(date_set) and len(additions) == 0:
        day = list(best_schedule)[0].strftime("%A")
        exclusions = best_schedule - date_set
        for d in exclusions.copy():
            if d < dates[0]:
                exclusions.remove(d)
                best_schedule.remove(d)
            if d > dates[-1]:
                exclusions.remove(d)
                best_schedule.remove(d)

        return {
            "start": min(best_schedule).strftime("%Y-%m-%d"),
            "end": max(best_schedule).strftime("%Y-%m-%d"),
            "schedule": "weekly",
            "day": day,
            "exclusions": [d.strftime("%Y-%m-%d") for d in exclusions],
        }
    return {
        "dates": [d.strftime("%Y-%m-%d") for d in dates],
    }


def name_to_id(name: str):
    """
    Convert a name to an id by removing non-alphanumeric characters and converting to lowercase.
    """
    s = re.sub(r"\s+", "_", name).lower()
    s = re.sub(r"[^a-z0-9_]", "", s)
    return s


def remove_html_tags(text):
    clean = re.compile("<.*?>")
    return re.sub(clean, "", text)


def generate_page(course, course_idx):
    time_slots = []
    filename = name_to_id(course["name_de"])
    filename = f"files/{filename}.mdx"
    text_de = ""
    text_en = ""
    for id in course["ids"]:
        if id not in course_idx:
            print(f"Course {id} not found in course_idx")
            continue
        courses = course_idx[id]
        for c in courses:
            description_de = textwrap.fill(c["course"]["description_de"], width=80)
            description_en = textwrap.fill(c["course"]["description_en"], width=80)
            text_de = f"{text_de} \n\n {description_de}"
            text_en = f"{text_en} \n\n {description_en}"
            time_slots.append(
                {
                    "name_de": c["course"]["name_de"],
                    "name_en": c["course"]["name_en"],
                    "room": c["room"]["name"],
                    "day": c["day"],
                    "startTime": DoubleQuotedScalarString(c["startTime"]),
                    "endTime": DoubleQuotedScalarString(c["endTime"]),
                    "supervisors": c["supervisors"],
                }
            )

    frontmatter = {}
    for key in ["name_de", "name_en", "description_de", "description_en"]:
        frontmatter[key] = course[key]
    frontmatter["time_slots"] = time_slots
    with open(filename, "w") as f:
        f.write("---\n")
        yaml.dump(frontmatter, f)
        f.write("---\n")
        f.write("\n")
        f.write('<Locale value="de">\n')
        f.write(text_de)
        f.write("\n\n")
        f.write("</Locale>\n")
        f.write('<Locale value="en">\n')
        f.write(text_en)
        f.write("\n\n")
        f.write("</Locale>\n")


def main():
    with open("./config.yaml", "r") as config_file:
        config = yaml.load(config_file)
    courses = config["courses"]
    calendar = config["calendar"]

    timezone = pytz.timezone(calendar["timezone"])
    products = {}
    with open("./products.json", "r") as products_file:
        result = json.load(products_file)
        raw_products = result["data"]
        for p in raw_products:
            id = p["id"]
            if id in products:
                print(f"Duplicate product id: {id}")
                continue
            raw_translations = p["translations"]
            translations = {}
            for t in raw_translations:
                if not t["summary"]:
                    continue
                locale = t["language"]
                name = t["description"]
                description = remove_html_tags(t["summary"])
                translations[locale] = {
                    "name": name,
                    "description": description,
                }
            if "de" not in translations:
                translations["de"] = {
                    "name": "",
                    "description": "",
                }
            if "en" not in translations:
                translations["en"] = {
                    "name": "",
                    "description": "",
                }

            products[id] = {
                "name": p["description"],
                "name_de": translations["de"]["name"],
                "name_en": translations["en"]["name"],
                "description_de": translations["de"]["description"],
                "description_en": translations["en"]["description"],
            }

    bookings = []
    booking_dict = {}
    with open("./bookings.json", "r") as bookings_file:
        result = json.load(bookings_file)
        raw_bookings = result["data"]
        for b in raw_bookings:
            room_id = b["productId"]
            course_id = b["linkedProductId"]
            if room_id not in products:
                print(f"Room {room_id} not found in products")
                continue
            if course_id not in products:
                print(f"Course {course_id} not found in products")
                continue
            startStr = b["startDate"]
            endStr = b["endDate"]
            startDate = parser.parse(startStr).astimezone(timezone)
            endDate = parser.parse(endStr).astimezone(timezone)
            date = startDate.date()

            raw_supervisors = b["supervisors"]
            supervisors = []
            for s in raw_supervisors:
                name = s["firstName"] + " " + s["lastName"]
                supervisors.append({"name": name})

            booking = {
                "id": b["id"],
                "course_id": course_id,
                "room": products[room_id],
                "room_id": room_id,
                "course": products[course_id],
                "startDate": b["startDate"],
                "endDate": b["endDate"],
                "day": weekdays[startDate.weekday()],
                "startTime": startDate.time().strftime("%H:%M"),
                "endTime": endDate.time().strftime("%H:%M"),
                "supervisors": supervisors,
                "dates": [date],
            }
            key = (
                booking["course_id"],
                booking["room_id"],
                booking["day"],
                booking["startTime"],
                booking["endTime"],
            )
            if key not in booking_dict:
                booking_dict[key] = booking
            else:
                existing_booking = booking_dict[key]
                existing_booking["dates"].append(date)

    bookings = booking_dict.values()

    course_idx = {}
    schedules = create_schedules(calendar)
    for booking in bookings:
        print(booking["course"]["name"], booking["course_id"])
        print(parse_dates(booking, schedules))

        course_id = booking["course_id"]
        if course_id not in course_idx:
            course_idx[course_id] = []
        course_idx[course_id].append(booking)
        # print(course_id, booking["course"]["name"])

    for course in courses:
        generate_page(course, course_idx)


if __name__ == "__main__":
    main()
