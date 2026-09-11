import { api } from '../api/client';
import WorkoutForm from '../components/WorkoutForm';

export default function LogWorkout() {
  return (
    <div className="page">
      <h2 className="page-title">Log Workout</h2>
      <div className="card-form">
        <WorkoutForm
          mode="create"
          onSubmit={(payload, photoFile) => api.logWorkout(payload, photoFile)}
        />
      </div>
    </div>
  );
}
