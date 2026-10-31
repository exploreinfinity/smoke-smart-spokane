# Chatbot offline test

Run date: 2026-10-31. Each test question is a paraphrase that does not copy the stored question. The bot returns its top match. A reviewer set the expected answer first.

**Answer bank size:** 21
**Top-1 accuracy:** 34 of 34 (100 percent)
**Right answer in top 2:** 34 of 34

| Question | Expected | Got | Score | Match |
|---|---|---|---|---|
| what is the air quality index | what-aqi | what-aqi | 0.36 | yes |
| what do the AQI colors mean | what-aqi | what-aqi | 0.4 | yes |
| where can I see today's air quality | where-check | where-check | 0.29 | yes |
| which website shows smoke levels in Spokane | where-check | where-check | 0.13 | yes |
| who is sensitive to smoke | who-sensitive | who-sensitive | 0.18 | yes |
| are kids at higher risk from wildfire smoke | who-sensitive | who-sensitive | 0.41 | yes |
| can my kid go to recess when it is smoky | kids-outside | kids-outside | 0.22 | yes |
| should my child play soccer outside today | kids-outside | kids-outside | 0.64 | yes |
| does an N95 work against smoke | masks | masks | 0.16 | yes |
| are cloth masks useful for wildfire smoke | masks | masks | 0.43 | yes |
| how do I set up a clean room at home | clean-room | clean-room | 0.43 | yes |
| what can I do to make my bedroom safer from smoke | clean-room | clean-room | 0.31 | yes |
| how to build a cheap air filter with a box fan | diy-filter | diy-filter | 0.57 | yes |
| I cannot afford an air purifier | diy-filter | diy-filter | 0.21 | yes |
| where can I go if my house has no clean air | no-clean-air | no-clean-air | 0.29 | yes |
| is there a friend's place or public space with cleaner air | no-clean-air | no-clean-air | 0.5 | yes |
| what do I do with my air conditioner during smoke | hvac-car | hvac-car | 0.13 | yes |
| should I use recirculate in my car | hvac-car | hvac-car | 0.61 | yes |
| should I open the windows | windows | windows | 0.42 | yes |
| what are the symptoms of breathing smoke | symptoms | symptoms | 0.35 | yes |
| when should I go to the hospital because of smoke | symptoms | symptoms | 0.09 | yes |
| my son has asthma how do I prepare | asthma | asthma | 0.23 | yes |
| I am pregnant is smoke dangerous | pregnant-older | pregnant-older | 0.24 | yes |
| what are my rights as a construction worker in smoke | workers | workers | 0.58 | yes |
| does my employer have to give me a respirator | workers | workers | 0.28 | yes |
| when does the high school cancel football for smoke | sports | sports | 0.28 | yes |
| why does the AQI change every hour | why-changes | why-changes | 0.42 | yes |
| tell me about the Spokane Complex fire in 2026 | this-summer | this-summer | 0.37 | yes |
| how many homes burned in August | this-summer | this-summer | 0.32 | yes |
| how many smoke days does Spokane get per year | how-often | how-often | 0.36 | yes |
| my home burned where can I get assistance | fire-help | fire-help | 0.22 | yes |
| who do I call for evacuee recovery help | fire-help | fire-help | 0.42 | yes |
| I am young and fit so smoke does not matter right | healthy-myth | healthy-myth | 0.44 | yes |
| is this chatbot real medical advice | about-bot | about-bot | 0.73 | yes |

## Behavior tests (typed into the live widget)

| Test | Input | Pass |
|---|---|---|
| AQI lookup, orange | AQI 130 | yes |
| Bare number lookup | 250 | yes |
| AQI lookup, good | AQI 45 | yes |
| Emergency keyword | I can't breathe | yes |
| Emergency keyword, chest pain | I have chest pain | yes |
| Out-of-scope fallback | what is pizza | yes |
| Worker training note appears at AQI 85 | AQI 85 | yes |
| Respirator note appears at AQI 130 | AQI 130 | yes |
| Quiz completes with 3 of 3 | (quiz) | yes |
| Suggested question chip returns an answer | (chip) | yes |
| Spanish toggle shows Spanish poster and flyer | (toggle) | yes |
