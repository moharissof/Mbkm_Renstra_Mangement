import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock } from "lucide-react"

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>
              <Skeleton className="h-5 w-36" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-48" />
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center pt-6">
            <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="mt-4 w-full">
              <div className="bg-gray-50 p-3 rounded-lg mb-2">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Edit Tabs */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>
              <Skeleton className="h-5 w-24" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-64" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </TabsTrigger>
                <TabsTrigger value="password" className="flex items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  Kata Sandi
                </TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="grid grid-cols-4 items-center gap-4">
                      <Skeleton className="h-4 w-16 col-span-1" />
                      <Skeleton className="h-10 col-span-3" />
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
