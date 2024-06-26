# 这是一个质量管理课程的质量检验游戏程序
前端基于react开发，后端基于python的fastapi开发，后端主要用于记录学生游戏数据。

<img src="./assets/page1.png" width='400' height='200' style="display: block; margin: 2 auto"/>
<img src="./assets/product.png" width='400' height='200' style="display: block; margin: 2 auto"/>
<img src="./assets/one-step.png" width='400' height='200' style="display: block; margin: 2 auto"/>
<img src="./assets/two-step.png" width='400' height='200' style="display: block; margin: 2 auto"/>
<img src="./assets/teacherpage.png" width='400' height='200' style="display: block; margin: 2 auto"/>
## 前端介绍

前端运行方法：
cd到前端目录 "解压文件夹/QualityControlGames/frontend"，然后运行
`npm install`
待安装完成后，运行
`npm run dev`
即可通过本地`http://localhost:5173`访问。

`学生入口`为学生需要进入的入口，学生需要先输入自己的组名，然后选择某个产品进入交验批检验。产品检验分为一次检验和二次检验，登记检验结果时，默认为一次检验的界面，需要登录二次检验时，点选`开启二次检验`按钮。
目前提供了“螺丝钉”，“手机屏幕”，以及“玩具汽车”三个产品的检验。螺丝钉和玩具汽车为计件检验，手机屏幕为记点检验。

产品页面提供了产品的相关信息，左上角`#400`表示产品交验批的批量为400，左下角分别给出了检验的要求，包括接收质量限（AQL）的值、检验水平（I、II、III）以及检验方案（一次检验或二次检验）。

`老师入口`为老师进入窗口，用于课堂展示学生互动进度，显示了学生检验的进度。进入该界面时会提示输入密码，密码的设置在`.env`文件中，如果不设密码则可以直接登录。登录后点击`开始动态更新`按钮即可每5s刷新一次学生互动进度。
点击右下角的`重置当前记录`可以另存当前记录并生成新的记录，用于不同课堂学生记录的管理。

## 后端介绍

后端运行方法：
cd到后端目录"解压文件夹/QualityControlGames/server"，然后运行
`pip install -r requirements.txt`安装依赖，
待完成后，运行
`uvicorn main:app --reload --host 127.0.0.1 --port 8001`
即可通过`http://localhost:8001`访问后端。
