export const jobsStore = new Map();

export const createJob = (type, payload) => {
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record = {
    id: jobId,
    type,
    payload,
    status: 'PENDING',
    stage: 'INITIALIZING',
    progress: 0,
    result: null,
    error: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  jobsStore.set(jobId, record);
  return record;
};

export const updateJob = (jobId, updates) => {
  const job = jobsStore.get(jobId);
  if (!job) return null;
  const updated = {
    ...job,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  jobsStore.set(jobId, updated);
  return updated;
};

export const getJobStatus = (req, res) => {
  const { jobId } = req.params;
  const job = jobsStore.get(jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      error: `Job ${jobId} not found`
    });
  }
  res.json({
    success: true,
    data: job
  });
};

export const retryJob = (req, res) => {
  const { jobId } = req.params;
  const job = jobsStore.get(jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      error: `Job ${jobId} not found`
    });
  }
  const updated = updateJob(jobId, {
    status: 'PENDING',
    stage: 'RETRYING',
    error: null
  });
  res.json({
    success: true,
    message: `Job ${jobId} queued for retry`,
    data: updated
  });
};
