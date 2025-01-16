import re

import writer as wf
import writer.ai
import pandas as pd

wf.Config.feature_flags = ["dataframeEditor"]
# Welcome to Writer Framework!
# This is a simple app to get you started with text completion.
# More documentation is available at https://dev.writer.com

lorem = " Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tellus neque, venenatis et dui in, rhoncus mattis dui. Donec auctor ante eget elit finibus scelerisque. Sed convallis, lorem ac porttitor dignissim, risus leo laoreet sapien, sed sagittis felis mauris in lectus. Fusce at condimentum erat. Proin in elit ultrices, tincidunt elit vitae, sollicitudin nisl. Vestibulum eu felis eu justo commodo sodales. Proin faucibus lorem at massa porta, quis ornare mauris fringilla. Nam volutpat rhoncus placerat. Fusce malesuada nunc a turpis dignissim maximus nec eget augue. Vivamus sed sem nec purus ultrices gravida in et lorem. "


def _get_editable_df():
    size = 5
    df = pd.DataFrame(
        {
            "number": [1, 2, 3] * size,
            "boolean": [True, False, True] * size,
            "object": [{"updatedAt": None}, {"updatedAt": None}, {"updatedAt": None}] * size,
            "text1": ["one", "two", lorem] * size,
            "text2": ["one", "two", "three"] * size,
            "text3": ["one", "two", "three"] * size,
            "text4": ["one", "two", "three"] * size,
            "text5": ["one", "two", "three"] * size,
        }
    )
    return wf.EditableDataFrame(df)


def handle_button_click(state):
    state["message"] = "% Loading up expert social media posts..."

    prompt = f"You are a social media expert. Generate 5 engaging social media posts about {state['topic']}. Include emojis."
    state["posts"] = writer.ai.complete(prompt)

    prompt = f"You are a social media expert. Generate 5 hashtags about {state['topic']}, delimited by spaces. For example, #dogs #cats #ducks #elephants #badgers"
    pattern = r"#\w+"
    hashtags = re.findall(pattern, writer.ai.complete(prompt))
    state["tags"] = {item: item for item in hashtags}

    state["message"] = ""


# Initialize state here

wf.init_state(
    {
        "posts": "",
        "topic": "writing",
        "message": "",
        "editable_df": _get_editable_df(),
    }
)

