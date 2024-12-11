import os
import ast
import torch
import json


# 将字符串转换为tensor
def string_to_tensor(string, type, shape):
    data_list = ast.literal_eval(string)
    type = eval("torch." + type)
    # 转换为 PyTorch 张量
    Tensor = torch.tensor(data_list, dtype=type)
    result = Tensor.reshape(shape)
    return result.tolist()
    # tolist()将tensor转换为list，因为torch.tensor类型不能序列化，需要先转为list类型


# file_path: 输入文件路径
# save_path: 转换完成后保存文件路径
def save_tensor_to_file(file_path, save_path):
    savejson = {}
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            data = json.load(f)
        for layer in data:
            name = layer['layer_name']
            Str = layer['layer_tensor']
            type = layer['tensor_type']
            shape = layer['tensor_shape']
            len = layer['layer_nbytes']
            tensor = string_to_tensor(Str, type, shape)
        # 保存为json文件
            trfm = {
                "layer_name": name,
                "layer_tensor": tensor,
                "tensor_shape": shape,
                "tensor_type": type,
                "layer_nbytes": len
            }
            savejson[name] = trfm
        with open(save_path, 'w') as f:
            json.dump(trfm, f)
        print("张量已保存到文件：", save_path)
    else:
        assert "File does not exist"


# path = './data.json'
# save_tensor_to_file(path, './data_tensor.json')


