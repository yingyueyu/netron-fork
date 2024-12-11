import * as base from "../base.js";

/**
 * @description 将张量数据_tensors 转换成 对应JSON 数据
 * @param {Map} tensors
 * @returns {{layer_name:string, layer_tensor:string, tensor_shape:[number,number], tensor_type:string, layer_nbytes:number}[]} JSON数据
 * @author jiangzhi
 * @date 2024-12-10
 * @version 1.0
 */

export function tensorsConversion(tensors) {
  const result = [];

  for (const [key, _value] of tensors) {
    const layer_name = getLayerName(key);

    const layer_tensor = getLayerTensor(key);
    if (!layer_tensor) continue;

    const tensor_shape = getTensorShape(key);
    if (!tensor_shape) continue;

    const tensor_type = getTensorType(key);
    if (!tensor_type) continue;

    const layer_nbytes = getLayerNbytes(key);
    if (!layer_nbytes) continue;

    result.push({
      layer_name,
      layer_tensor,
      tensor_shape,
      tensor_type,
      layer_nbytes,
    });
  }

  handleExportRequst(result);
  return result;
}

const getLayerName = (key, sign = "$_$") =>
  key?.name + sign + key?.value[0]?.name ?? "";

const getLayerTensor = (key) =>
  new base.Tensor(key?.value[0].initializer).toString();

const getTensorShape = (key) => key?.value[0]?.type?.shape?.dimensions ?? null;

const getTensorType = (key) => key?.value[0]?.type?.dataType ?? null;

const getLayerNbytes = (key) =>
  key?.value[0]?.initializer?._data?.length ?? null;

// 请求导出api
const handleExportRequst = (data) => {
  fetch("/api/export_tensors", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json(); // 解析响应体为JSON格式
    })
    .then((data) => {
      console.log("Success:", data); // 成功时打印返回的数据
    })
    .catch((error) => {
      console.error("Error:", error); // 发生错误时打印错误信息
    });
};
