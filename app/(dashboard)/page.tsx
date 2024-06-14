import { GetFormStats, GetForms } from "@/action/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode, Suspense } from "react";
import {LuView} from "react-icons/lu";
import {FaTrash, FaWpforms} from "react-icons/fa";
import {HiCursorClick} from "react-icons/hi";
import {TbArrowBounce} from "react-icons/tb";
import { Separator } from "@/components/ui/separator";
import CreateFormBtn from "@/components/CreateFormBtn";
import { Form } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {BiRightArrowAlt} from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import DeleteFormButton from "@/components/DeleteFormButton";



export default function Home() {

  return (
    // <div className="container pt-4">Hello</div>
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true}/>}>
        <CardStatsWrapper/>
      </Suspense>
      <Separator className="my-6"/>
      <h2 className="text-4xl font-bold col-span-2">My Form</h2>
      <Separator className="my-6"/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CreateFormBtn/>
      <Suspense 
      fallback={[1,2,3,4].map((el)=>(
        <FormCardSkelton key={el} />
      ))}
      >
        <FormCards/>
      </Suspense>
      </div>
    </div>
  );
}

async function CardStatsWrapper() {
  const stats = await GetFormStats();

  return <StatsCards loading={false} data={stats}/>;
}

interface StatsCardProps{
  data? : Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}

function StatsCards(props:StatsCardProps){
  const {data, loading} = props;

  return(
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Total visits"
       icon={<LuView className="text-blue-600" />}
       helperText = "All time form visit"
       value={data?.visits.toLocaleString() || ""}
       loading={loading}
       className="shadow-md shadow-blue-600"
       />

       <StatsCard title="Total Submissions"
       icon={<FaWpforms className="text-green-600" />}
       helperText = "All time form submissions"
       value={data?.submissions.toLocaleString() || ""}
       loading={loading}
       className="shadow-md shadow-green-600"
       />

       <StatsCard title="Total Submission Rate"
       icon={<HiCursorClick className="text-yellow-600" />}
       helperText = "All visit & submission rate based"
       value={data?.submissionsRate.toLocaleString() + "%" || ""}
       loading={loading}
       className="shadow-md shadow-yellow-600"
       />

       <StatsCard title="Total Bounced"
       icon={<TbArrowBounce className="text-red-600" />}
       helperText = "All time Bounced"
       value={data?.bounceRate.toLocaleString() + "%" || ""}
       loading={loading}
       className="shadow-md shadow-red-600"
       />
    </div>
  );
}

export function StatsCard({
  title,
  value,
  icon,
  helperText,
  loading,
  className,
}:{
  title:string;
  value:string;
  helperText:string;
  className:string;
  loading:boolean;
  icon:ReactNode;
}) {
  return(
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading &&(
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="text-xs text-muted-foreground pt-1">
          {helperText}
        </p>
      </CardContent>
    </Card>
  )
}

function FormCardSkelton(){
  return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full"/>;
}

async function FormCards() {
  const forms = await GetForms();
  return ( 
  <>
  {forms.map((form)=>(
    <FormCard key={form.id} form={form}/>
  ))}</>
  );
}

async function FormCard({form}:{form:Form}) {



  // const [isDeleting, setIsDeleting] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);

  // const handleDelete = () => {
  //   setIsDeleting(true);
  // };

  // const handleConfirmDelete = async () => {
  //   try {
  //     await DeleteForm(form.id);
  //     window.location.reload();
      
  //   } catch (error) {
  //     console.error('Failed to delete form', error);
      
  //   } finally {
  //     setIsDeleting(false);
  //   }
  // };

  // const handleCancelDelete = () => {
  //   setIsDeleting(false);
  //   setIsChecked(false); // Reset the checkbox state
  // };

  // const handleCheckboxChange = () => {
  //   setIsChecked(!isChecked); // Toggle the checkbox state
  // };

  // const ConfirmationDialog = () => (
  //   <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  //     <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
  //       <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
  //       <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
  //       <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
  //         <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
  //           <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
  //             Delete Form
  //           </h3>
  //           <div className="mt-2">
  //             <p className="text-sm text-gray-500">
  //               Are you sure you want to delete this form?
  //             </p>
  //             {form.published && (
  //               <div className="mt-4">
  //                 <label className="flex items-center">
  //                   <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
  //                   <span className="ml-2">If you delete this form, your form submission will also be deleted.</span>
  //                 </label>
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //         <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
  //           <button type="button" className={`mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${form.published && !isChecked ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`} onClick={handleConfirmDelete} disabled={form.published && !isChecked}>
  //             Sure
  //           </button>
  //           <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleCancelDelete}>
  //             Cancel
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  

  return (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 justify-between"> 
        <span className="truncate font-bold">
        {form.name}
        </span>
        {form.published && <Badge>Published</Badge>}
        {!form.published && <Badge variant={"destructive"}>Draft</Badge>}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(),{
            addSuffix:true,
          })}
          {
            form.published && (
              <span className="flex items-center gap-2">
                <LuView className="text-muted-foreground" />
                <span>{form.visits.toLocaleString()}</span>
                <FaWpforms className="text-muted-foreground" />
                <span>{form.submissions.toLocaleString()}</span>
              </span>
            )
          }
        </CardDescription>
    </CardHeader>
    <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
          {form.description || "No Description"}
    </CardContent>
    <CardFooter>
    <DeleteFormButton form={form} />
    {/* <Button variant={"secondary"}
        asChild className="w-full mt-2 text-md gap-4 mr-2 text-sm hover:bg-red-600 hover:text-white"
        onClick={handleDelete}
        >
          <div className="flex items-center justify-between">Delete <FaTrash/></div>
        </Button> */}
      {form.published && (
        <Button asChild className="w-full mt-2 text-md gap-4 text-sm">
          <div className="flex items-center justify-between"><Link href={`/forms/${form.id}`}>View Submissions</Link> <BiRightArrowAlt/></div>
        </Button>
      )}
      {!form.published && (
        <Button variant={"secondary"}
        asChild className="w-full mt-2 text-md gap-4 text-sm">
          <div className="flex items-center justify-between"><Link href={`/builder/${form.id}`}>Edit Form</Link> <FaEdit/></div>
        </Button>
      )}
    </CardFooter>
    {/* {isDeleting && <ConfirmationDialog />} */}
  </Card>
  );
}