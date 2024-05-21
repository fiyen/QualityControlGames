from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
import json
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Optional
import os
import shutil
import time
from datetime import datetime
import copy
from init_data import group_data_example

app = FastAPI()

# 解决跨域问题
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有请求方法
    allow_headers=["*"],  # 允许所有请求头
)

class DataIn(BaseModel):
    re: int
    ac: int
    nxpassed: int
    result: str
    nsample: int

class DataIn2(BaseModel):
    re2: int
    ac2: int
    nxpassed2: int
    result2: str
    nsample2: int

class DataIn3(BaseModel):
    re: Optional[int] = None
    ac: Optional[int] = None
    nxpassed: Optional[int] = None
    result: Optional[str] = None
    nsample: Optional[int] = None
    re2: Optional[int] = None
    ac2: Optional[int] = None
    nxpassed2: Optional[int] = None
    result2: Optional[str] = None
    nsample2: Optional[int] = None

class TwoStepsData(BaseModel):
    onestep: DataIn
    twostep: DataIn2

class SampleData(BaseModel):
    onestep: DataIn
    twostep: TwoStepsData

class GameData(BaseModel):
    use_twosteps: bool
    sampledata: Dict[int, SampleData]

class GroupData(BaseModel):
    luosiding: GameData
    toycar: GameData
    phone: GameData

class DataFrame(BaseModel):
    groups: Dict[str, GroupData]

class PartDataFrame(BaseModel):
    groupName: str
    gameTitle: str
    batch: int
    cway: str
    updates: DataIn3

@app.post("/save_data")
async def save_data(data: DataFrame):
    try:
        with open("./assets/results.json", "w") as file:
            json.dump(data.dict(), file)
        return {"status_code": 200, "message": "Data saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/load_data")
async def load_data():
    try:
        with open("./assets/results.json", "r") as file:
            data = json.load(file)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error loading data")
    
@app.post("/save_partial_data")
async def save_partial_data(data: PartDataFrame):
    try:
        # 加载现有数据
        with open("./assets/results.json", "r") as file:
            existing_data = json.load(file)
        print(group_data_example)
        if data.groupName not in existing_data['groups']:
            existing_data["groups"][data.groupName] = json.loads(group_data_example.json())
        group_data = existing_data["groups"][data.groupName]
        game_data = group_data[data.gameTitle]
        sample_data = game_data["sampledata"][str(data.batch)]
        
        if data.cway == "twostep":
            target_data_onestep = sample_data["twostep"]["onestep"]
            target_data_twostep = sample_data["twostep"]["twostep"]
            for field, value in data.updates.dict().items():
                if value is not None:
                    if '2' in field:
                        target_data_twostep[field] = value
                    else:
                        target_data_onestep[field] = value
        else:
            target_data = sample_data[data.cway]
            for field, value in data.updates.dict().items():
                if value is not None:
                    target_data[field] = value

        # 保存更新后的数据
        with open("./assets/results.json", "w") as file:
            json.dump(existing_data, file, indent=4)

        return {'status_code': 200, "message": "Data updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/init_data")
async def init_data():
    try:
        # 获取当前时间，格式为 YYYYMMDD_HHMMSS
        current_time_str = datetime.now().strftime("%Y%m%d_%H%M%S")
        base_file_path = "./assets/results_base.json"
        target_file_path = f"./assets/results_{current_time_str}.json"

        # 重命名 results.json 文件
        os.replace("./assets/results.json", target_file_path)
        
        # 复制 results_base.json 内容到 results.json
        shutil.copyfile(base_file_path, "./assets/results.json")
        
        return {"message": "Data initialized successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/get_data_list")
async def get_data_list():
    try:
        files = os.listdir("./assets")  # 列出assets文件夹中的所有文件名
        data_list = [file for file in files if file.endswith(".json") and file != "results_base.json"]
        return [{"value": data, "label": data} for data in data_list]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/download_file")
async def download_file(fileName: str):
    file_path = os.path.join("./assets", fileName)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type='application/octet-stream', filename=fileName)
    raise HTTPException(status_code=404, detail="文件未找到")