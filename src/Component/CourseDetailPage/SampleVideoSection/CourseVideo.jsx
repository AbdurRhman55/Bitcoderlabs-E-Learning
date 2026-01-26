import VideoRight from "./VideoRIght";
import LeftVideo from "./LeftVideo";

export default function CourseVideoPreview({ course }) {
  return (
    <section id="course-video-section" className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/50">
      <div className="max-w-7xl mx-auto px-9">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/*  Left: Video Section */}
          <LeftVideo course={course} />

          {/*  Right: Info Section */}
          <VideoRight course={course} />
        </div>
      </div>
    </section>
  );
}
