import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Download, Upload } from 'lucide-react';
import Dropdown, { Option } from './dropdown'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AuthContext from './AuthContext';
import React, { useEffect, useContext, useRef, useState } from 'react';
import { DataFrame } from '@/components/ui/initData'
// 导入 Recharts 库所需组件
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 创建 data 用于全局保存当前的统计情况
let data: DataFrame;

interface DataIn {
  're': number;
  'ac': number;
  'nxpassed': number;
  'result': string;
  'nsample': number;
  're2': number;
  'ac2': number;
  'nxpassed2': number;
  'result2': string;
  'nsample2': number;
}

const range = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (v, k) => k + start);
};

function StatsPage() {
  const batches = range(1, 20);
  const gameTitles = ['luosiding', 'toycar', 'phone']
  const { markVisited } = useContext(AuthContext);

  const [groupNames, setGroupNames] = useState<string[]>([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [countData, setCountData] = useState<{ [key: string]: { onestep: any[], twostep: any[] } }>({}); // 使用对象结构化数据
  const [fileList, setFileList] = useState<Option[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<Option | null>(null);

  let intervalId = useRef(null);

  async function loadFileList() {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/get_data_list`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const fileListData = await response.json();
      setFileList(fileListData);
    } catch (error) {
      console.error('Error while loading file list:', error);
    }
  }
  

  async function getCountData(): Promise<void> {
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/load_data`
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }

      data = await response.json();
      let loadedGroupNames = Object.keys(data.groups);
      loadedGroupNames = loadedGroupNames.filter((value) => value !== "//##placeholder##//");

      setGroupNames(loadedGroupNames);

      const newCountData = {};

      loadedGroupNames.forEach((groupName) => {
        const onestepData = [];
        const twostepData = [];
        gameTitles.forEach((gameTitle) => {
          batches.forEach((batch, idx) => {
            const index = `${gameTitle.charAt(0).toUpperCase()}${idx + 1}`;
            const newdata = getData(groupName, gameTitle, batch, 'onestep') as DataIn;
            onestepData.push({ index, nsample: newdata.nsample, nxpassed: newdata.nxpassed, ac: newdata.ac, re: newdata.re });
      
            const newdata2 = getData(groupName, gameTitle, batch, 'twostep') as DataIn;
            twostepData.push({ index, nsample: newdata2.nsample, nsample2: newdata2.nsample2, nxpassed2: newdata.nxpassed2, ac2: newdata.ac2, re2: newdata.re2});
          });
        });
        newCountData[groupName] = { onestep: onestepData, twostep: twostepData };
      });
      

      setCountData(newCountData);
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  }

  function downloadFile() {
    if (selectedFileName) {
      window.open(`${import.meta.env.VITE_SERVER_URL}/download_file?fileName=${selectedFileName}`, '_blank');
    } else {
      toast.info("请先选择需要下载的文件！");
    }
  }

  function getData(groupName: string, gameTitle: string, batch: number, cway: string): number | string | DataIn {
    const fields = ['ac', 're', 'nsample', 'nxpassed', 'result'];
    const fields2 = ['ac2', 're2', 'nsample2', 'nxpassed2', 'result2']
    const newdata: DataIn = {
      re: -1,
      ac: -1,
      nxpassed: -1,
      result: '',
      nsample: -1,
      re2: -1,
      ac2: -1,
      nxpassed2: -1,
      result2: '',
      nsample2: -1
    };

    if (cway === "twostep") {
      const { onestep, twostep } = data.groups[groupName][gameTitle].sampledata[batch].twostep;
      fields.forEach(field => {
        newdata[field] = onestep[field];
      });
      fields2.forEach(field => {
        newdata[field] = twostep[field];
      });
    } else {
      const onestep = data.groups[groupName][gameTitle].sampledata[batch].onestep
      fields.forEach(field => {
        newdata[field] = onestep[field];
      });
    }
    return newdata;
  }

  function initData() {
    const url = `${import.meta.env.VITE_SERVER_URL}/init_data`
    fetch(url, {
      method: 'GET'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // 这里你可以访问 `response.json()` 或其他方式处理返回的数据
      // 如：return response.json();
    })
    .then(data => {
      // 处理成功响应的数据
      // 比如：console.log(data);
      loadFileList();
      // 显示成功信息
      toast.info(`已成功重置数据。`);
    })
    .catch(error => {
      console.error('Error in initiating data:', error);
    });
  }

  function genMsg(groupName: string, gameTitle: string, batch: number, cway: string): string | JSX.Element {
    if (cway === 'onestep') {
      if (gameTitle === "toycar") {
        return " ";
      }
    } else {
      if (gameTitle === 'luosiding') {
        return " ";
      }
    }

    const newdata = getData(groupName, gameTitle, batch, cway) as DataIn;
    const result = newdata['result'];
    const result2 = newdata['result2'];

    if (result2 !== '') {
      if (result === '合格') {
        return (<div>&#10004;</div>);
      } else if (result === '不合格') {
        return (<div>&#10008;</div>);
      } else if (result === '二次检验' && result2 === '合格') {
        return (<div>&#60;&#10004;</div>);
      } else if (result === '二次检验' && result2 === '不合格') {
        return (<div>&#187;&#10008;</div>);
      } else {
        return "???"
      }
    } else {
      if (result === '合格') {
        return (<div>&#10004;</div>);
      } else if (result === '不合格') {
        return (<div>&#10008;</div>);
      }
    }
    return (<div>&#45;</div>);
  }

  const handleChange = (newValue:string) => {
    const newIndex = fileList.find(value => value.value === newValue);
    if (newIndex) {
      if (newValue !== selectedFileName) {
        setSelectedFileName(newValue)
      }
    } else {
      setSelectedFileName(null)
    }
  };

  useEffect(() => {
    markVisited("StatsPage");
    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    }
  }, [markVisited]);

  useEffect(() => {
    loadFileList();
  }, []);

  useEffect(() => {
    if (isAutoRefresh) {
      intervalId.current = setInterval(() => {
        getCountData();
      }, 5000);
    } else {
      if (intervalId.current) clearInterval(intervalId.current);
    }

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, [isAutoRefresh]);

  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
  };

  return (
    <div style={{ minHeight: "300vh" }}>
      <Tabs defaultValue="statistics" className="w-[1400px] h-[1000px]">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="statistics">STATISTICS</TabsTrigger>
          <TabsTrigger value="counts">COUNTS</TabsTrigger>
          <TabsTrigger value="save/load">SAVE/LOAD</TabsTrigger>
        </TabsList>
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>统计结果</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Table>
                <TableCaption>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button id="two-step-bt" onClick={initData} style={{ marginLeft: 'auto' }}>点击重置数据</Button>
                    <ToastContainer />
                  </div>
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[10px]">组名</TableHead>
                    <TableHead className="w-[5px]">产品</TableHead>
                    {batches.map((i) => (
                      <TableHead key={`batch-${i}`}>{i}</TableHead>
                    ))}
                    {batches.map((i) => (
                      <TableHead key={`batch2-${i}`}>2-{i}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupNames.length > 0 && groupNames.map((group) => (
                    gameTitles.map((title) => (
                      <TableRow key={`${group}-${title}`}>
                        <TableCell>{group.length > 3 ? `${group.charAt(0)}..${group.charAt(group.length - 1)}` : group}</TableCell>
                        <TableCell>{title}</TableCell>
                        {batches.map((batch) => (
                          <TableCell key={`${group}-${title}-${batch}`}>{genMsg(group, title, batch, 'onestep')}</TableCell>
                        ))}
                        {batches.map((batch) => (
                          <TableCell key={`${group}-${title}-${batch}-2`}>{genMsg(group, title, batch, 'twostep')}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="counts">
          <Card>
            {groupNames.length > 0 && groupNames.map((group, idx) => (
              <div key={idx}>
                <CardHeader>
                  <CardTitle>{group}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={countData[group].onestep}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="index" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="nsample" stroke="#8884d8" name="样本量" />
                      <Line type="monotone" dataKey="nxpassed" stroke="#82ca9d" name="不合格品量" />
                      <Line type="monotone" dataKey="re" stroke="#ff7300" />
                      <Line type="monotone" dataKey="ac" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>

                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={countData[group].twostep}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="index" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="nsample" stroke="#82ca9d" name="样本量" />
                      <Line type="monotone" dataKey="nsample2" stroke="#ff7300" name="样本量2" />
                      <Line type="monotone" dataKey="nxpassed" stroke="#8884d8" name="不合格品量" />
                      <Line type="monotone" dataKey="nxpassed2" stroke="#ffc658" name="不合格品量2" />
                    </LineChart>
                  </ResponsiveContainer>

                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={countData[group].twostep}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="index" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="re" stroke="#ff7300" />
                      <Line type="monotone" dataKey="re2" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="ac" stroke="#8884d8" />
                      <Line type="monotone" dataKey="ac2" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>

              </div>
            ))}
          </Card>
        </TabsContent>
        <TabsContent value="save/load">
          <Card>
            <CardHeader>
              <CardTitle>保存和读取</CardTitle>
              <CardDescription>
                点击保存可下载当前结果的json文件，点击上传将上传json文件，注意json必须是通过保存下载且未经更改的，否则会报错.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Dropdown 
                options={fileList}
                value={selectedFileName}
                onChange={handleChange}
                label="请选择下载文件"
              ></Dropdown>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button id="download-card" onClick={downloadFile} style={{ display: 'flex', alignItems: 'center' }}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>点击下载</span>
                </Button>
              </div>
              <ToastContainer/>
            </div>
            </CardContent>
          </Card>
        </TabsContent>
      <div className="flex items-center space-x-2 w-[300px] mt-4">
        <Switch id="two-step-qc" onCheckedChange={toggleAutoRefresh} />
        <Label htmlFor="two-step-qc">自动刷新数据视图</Label>
      </div>
      </Tabs>
    </div>
  )
}

export default StatsPage;
