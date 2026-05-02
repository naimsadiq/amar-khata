import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUp, ArrowDown } from 'lucide-react';

export function RecentTransactions() {
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle>সাম্প্রতিক লেনদেন</CardTitle>
        <CardDescription>
          এই মাসে আপনার সর্বশেষ ৫টি লেনদেন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex items-center">
            <Avatar className="h-9 w-9 bg-[--color-brand-l]">
              <AvatarFallback><ArrowUp className="h-4 w-4 text-[--color-brand-d]"/></AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">করিম মিয়া</p>
              <p className="text-sm text-muted-foreground">বকেয়া পরিশোধ</p>
            </div>
            <div className="ml-auto font-medium text-green-600">+৳৫,০০০</div>
          </div>
          <div className="flex items-center">
             <Avatar className="h-9 w-9 bg-[--color-red-l]">
              <AvatarFallback><ArrowDown className="h-4 w-4 text-[--color-red]"/></AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">মেসার্স আলম ট্রেডার্স</p>
              <p className="text-sm text-muted-foreground">মাল ক্রয় (সাপ্লায়ার)</p>
            </div>
            <div className="ml-auto font-medium text-red-600">-৳১২,৫০০</div>
          </div>
          <div className="flex items-center">
            <Avatar className="h-9 w-9 bg-[--color-brand-l]">
              <AvatarFallback><ArrowUp className="h-4 w-4 text-[--color-brand-d]"/></AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">POS বিল #১০৪৫</p>
              <p className="text-sm text-muted-foreground">নগদ বিক্রয়</p>
            </div>
            <div className="ml-auto font-medium text-green-600">+৳৩,২৮০</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}