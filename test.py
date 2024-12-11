import torch
import json
import String2Tensor as st

st.save_tensor_to_file('./result.json', './data_tensor.json')

# data = json.load(open('./data_tensor.json'))
# print(data['layer_tensor'])
#
# tensor_data = torch.tensor(data['layer_tensor'])
# print(tensor_data.shape)
