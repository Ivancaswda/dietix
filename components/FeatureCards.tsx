import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MicIcon, ShieldIcon, CalendarIcon } from "lucide-react";

function FeatureCards() {
  return (
      <div className="grid md:grid-cols-2 gap-8  mb-12">

        {/* HOW TO USE */}
        <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/40 rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-11 h-11 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl flex items-center justify-center">
                <MicIcon className="h-5 w-5 text-primary" />
              </div>
              Как пользоваться
            </CardTitle>
            <CardDescription>
              Простые шаги для начала голосового общения
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-4">
            {[
              "Нажмите на кнопку микрофона, чтобы начать разговор",
              "Задавайте вопросы о составлении диеты и т.п",
              "Получайте мгновенные голосовые ответы от AI",
              "Просматривайте текст диалога в реальном времени",
            ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span className="text-sm text-muted-foreground">{text}</span>
                </div>
            ))}
          </CardContent>
        </Card>

        {/* FEATURES */}
        <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/40 rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative">
            <CardTitle className="flex  items-center gap-3 text-xl">
              <div className="w-11 h-11 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl flex items-center justify-center">
                <ShieldIcon className="h-5 w-5 text-primary" />
              </div>
              Возможности
            </CardTitle>
            <CardDescription>
              Расширенные функции для составления эффективной диеты
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-4">
            {[
              { icon: MicIcon, text: "Распознавание речи в реальном времени" },
              { icon: ShieldIcon, text: "Ответы на базе искусственного интеллекта" },
              { icon: CalendarIcon, text: "История разговоров и консультаций" },
            ].map(({ icon: Icon, text }, i) => (
                <div
                    key={i}
                    className="flex gap-3 items-center p-4 bg-muted/40 rounded-2xl hover:bg-muted/60 transition"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center mr-3">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm">{text}</span>
                </div>
            ))}
          </CardContent>
        </Card>
      </div>
  );
}

export default FeatureCards;
