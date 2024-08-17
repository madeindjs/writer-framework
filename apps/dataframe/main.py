import pandas
import writer as wf

import pandas
import writer as wf

df = pandas.DataFrame({'number': [1, 2, 3], 'text': ['one', 'two', 'three']})

wf.init_state({
	'mydf': wf.EditableDataframe(df)
})
#
# Subscribe this event handler to the `wf-dataframe-add` event
def on_record_add(state, payload):
	payload['record']['sales'] = 0 # default value inside the dataframe
	state['mydf'].record_add(payload)


# Subscribe this event handler to the `wf-dataframe-update` event
def on_record_change(state, payload):
    state['mydf'].record_update(payload)


# Subscribe this event handler to the `wf-dataframe-action` event
def on_record_action(state, payload):
	"""
	This event corresponds to a quick action in the drop-down menu to the left of the dataframe.
	"""
	record_index = payload['record_index']
	if payload.action == 'remove':
		state['mydf'].record_remove(payload)
	if payload.action == 'open':
		state['record'] = state['df'].record(record_index) # dict representation of record
