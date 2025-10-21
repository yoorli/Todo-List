<div align="center">

<!-- logo -->
<img src="https://user-images.githubusercontent.com/80824750/208554558-490845c9-959a-4823-9003-350ec4d221bf.png" width="400"/>

### 깃 리드미 템플릿 🖍️

[<img src="https://img.shields.io/badge/-Tailwind-important?style=flat&logo=google-chrome&logoColor=white" />]() [<img src="https://img.shields.io/badge/-TypeScript-blue?style=flat&logo=google-chrome&logoColor=white" />]() [<img src="https://img.shields.io/badge/Next.js-ㅎㄱㄷ두?style=flat&logo=google-chrome&logoColor=white" />]() 
<br/> [<img src="https://img.shields.io/badge/프로젝트 기간-2025.10.16~2025.10.20-fab2ac?style=flat&logo=&logoColor=white" />]()

</div> 

List
- 프로젝트 소개
- 프로젝트 화면 구성
- 사용한 기술 스택
- 기술적 이슈와 해결 과정
- 프로젝트 팀원


## 📝 소개
할 일 목록을 관리하는 To Do 서비스

<br />

### 화면 구성
|할 일 목록 페이지|
|:---:|
|<img width="375" height="812" alt="Image" src="https://github.com/user-attachments/assets/1aaa695b-4c28-4066-b485-a182f9932525" />|
| 목록 조회, 할 일 추가, 할 일 완료 |


|할 일 상세 페이지|
|:---:|
|<img width="282" height="671" alt="Image" src="https://github.com/user-attachments/assets/28406ec1-83b0-49ce-b8bd-405a9170d4a5" />|
|<img width="282" height="671" alt="Image" src="https://github.com/user-attachments/assets/fc83dc9c-6cd9-43aa-84ea-39cbc5a55ce4" />|
|할 일 수정, 할 일 삭제|

<br />

## ⚙ 기술 스택
### Front-end
<div>
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/JavaScript.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/TypeScript.png?raw=true" width="80">
</div>

### Tools
<div>
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/Github.png?raw=true" width="80">
</div>

<br />

## 📂 폴더 구조

```
src/
  app/
    api/
      oknu/[...path]/route.ts      # 외부 API 프록시
      upload/route.ts              
    page.tsx                       # 목록
    items/[id]/page.tsx            # 상세
  components/
    AddItem.tsx
    CheckList.tsx
    CheckListDetail.tsx
    ImageBox.tsx
    AutoTextarea.tsx
  libs/
    axios.ts
    api.ts
  styles/
    globals.css
```