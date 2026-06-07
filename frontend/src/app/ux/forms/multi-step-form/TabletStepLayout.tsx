type Props = {
  progress: React.ReactNode;
  stepContent: React.ReactNode;
  navigation: React.ReactNode;
};

export default function TabletStepLayout({ progress, stepContent, navigation }: Props) {
  return (
    <div className="md:flex md:space-x-6 p-6 max-w-6xl mx-auto">
      {/* Progress Sidebar */}
      <div className="hidden md:flex flex-col space-y-2 w-1/3">
        {progress}
      </div>

      {/* Step Content */}
      <div className="flex flex-col space-y-6 w-full md:w-2/3">
        {stepContent}
        {navigation}
      </div>
    </div>
  );
}
