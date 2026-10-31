# Smoke Smart Spokane

**Check. Clean. Cut back.**

A health communication campaign about wildfire smoke in Spokane County, Washington. It helps families, coaches and outdoor crews turn one number, the Air Quality Index (AQI), into one clear action.

**Live site:** https://exploreinfinity.github.io/smoke-smart-spokane/

**Last Update Date:** October 31, 2026

This is a student project for HSC 6665 Health Communication at the University of Florida. It is not an official campaign of any health agency, school district or employer.

## Why this campaign

On August 1, 2026, three fires became the Spokane Complex Fire. They burned nearly 10,000 acres and damaged or destroyed more than 900 structures. About 60,000 people were told to evacuate. The smoke that followed made the air unhealthy on 14 days by mid-August 2026. Local health advice starts at AQI 101, while many school rules start at 150. This campaign helps close that gap.

## What is in the site

- **Campaign overview:** the health issue, audience, goals and measurable objectives.
- **Socioecological framework:** messages and tactics at five levels, from individual to policy.
- **Health literacy strategy:** a color, number and action format, plain language and teach-back.
- **Logic model:** inputs, activities, outputs, and short-term and long-term outcomes.
- **Campaign materials:**
  - two social media posts
  - a school poster, the Smoke Day Play Plan
  - a worksite flyer and toolbox talk
  - Spanish versions of the poster and flyer
- **AI element:** a health FAQ chatbot with a teach-back quiz.
- **Video walkthrough** and a full reference list.

## The chatbot

The chatbot answers questions about smoke days in plain language. It works in three ways:

1. It matches a question to a reviewed bank of 21 answers, using TF-IDF and cosine similarity.
2. It turns an AQI number, such as "AQI 130", into a recommended action.
3. It shows a 911 message when it sees emergency words.

It runs fully in the browser. It collects and stores nothing. It gives general information only and is not medical advice.

## Folder guide

| Path | What it holds |
|---|---|
| `index.html` | The campaign website |
| `css/` | Styles |
| `js/` | Chatbot answer bank, chatbot engine and page script |
| `assets/` | Campaign graphics and fonts |
| `docs/` | Video script and chatbot test results |
| `tools/` | Scripts used to build the graphics and run tests |

## How this was made

An AI assistant (Claude, by Anthropic) helped code development. I set the strategy and chose the sources. The Spanish text was drafted with AI help and should be reviewed by a fluent speaker before real use.

## Sources and accuracy

The site lists its sources in the References section. Local figures come from news reports that cite agency data, and counts changed over time. Please confirm current numbers with the [Spokane Regional Clean Air Agency](https://www.spokanecleanair.org/current-air-quality) and the [Spokane Regional Health District](https://srhd.org/). Workplace rule details are at [lni.wa.gov](https://lni.wa.gov/).

## Safety note

This site gives general information, not medical advice. In an emergency, call 911.

## Rights

© 2026 Xinyue (Clover) Chen. All rights reserved. Please do not copy or reuse these materials without permission.

The fonts, Fraunces and Public Sans, are used under the SIL Open Font License. The license files are in `assets/fonts`.
