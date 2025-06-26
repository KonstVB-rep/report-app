import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectForm from "@/entities/deal/ui/Forms/ProjectForm";
import RetailForm from "@/entities/deal/ui/Forms/RetailForm";
import DialogComponent from "@/shared/ui/DialogComponent";

import { OrderResponse } from "../types";

type TabsDealTypeForms = {
  order: OrderResponse | null;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
};

const TabsDealTypeForms = ({
  order,
  isModalOpen,
  setIsModalOpen,
}: TabsDealTypeForms) => {
  if (!order) {
    return null;
  }

  return (
    <DialogComponent
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      classNameContent="p-3!"
    >
      <div className="flex w-full gap-4">
        <Tabs defaultValue="retail">
          <TabsList>
            <TabsTrigger value="retail">Розница</TabsTrigger>
            <TabsTrigger value="project">Проект</TabsTrigger>
          </TabsList>
          <TabsContent value="retail">
            <Card>
              <CardHeader className="p-3 border">
                <CardTitle>Информация по заявке:</CardTitle>
                <CardDescription className="flex gap-1 divide-x-1 divide-dashed divide-stone-500">
                  <span>Название заявки: {order.nameDeal}</span>
                  {order.dateRequest && (
                    <span>Дата: {order.dateRequest.toLocaleString()}</span>
                  )}
                  {order.contact && <span>Контакт: {order.contact}</span>}
                  {order.phone && <span>Телефон: {order.phone}</span>}
                  {order.email && <span>Email: {order.email}</span>}
                  {order.comments && <span>Комментарий: {order.comments}</span>}
                  {order.resource && (
                    <span>Источник/сайт: {order.resource}</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 p-3">
                <RetailForm orderId={order.id} managerId={order.manager} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="project">
            <Card>
              <CardHeader className="p-3 border">
                <CardTitle>{order.nameDeal}</CardTitle>
                <CardDescription>
                  {order.dateRequest && (
                    <span>Дата: {order.dateRequest.toLocaleString()}</span>
                  )}
                  {order.contact && <span>Контакт: {order.contact}</span>}
                  {order.phone && <span>Телефон: {order.phone}</span>}
                  {order.email && <span>Email: {order.email}</span>}
                  {order.comments && <span>Комментарий: {order.comments}</span>}
                  {order.resource && (
                    <span>Источник/сайт: {order.resource}</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 p-3">
                <ProjectForm orderId={order.id} managerId={order.manager} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DialogComponent>
  );
};

export default TabsDealTypeForms;
