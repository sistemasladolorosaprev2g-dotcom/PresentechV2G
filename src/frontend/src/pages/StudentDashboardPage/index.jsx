import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout';
import { studentService } from '../../services/studentService';
import { Spinner } from '../../components/common';

import { StudentTabs } from '../../components/layout/StudentTabs';

export const StudentDashboardView = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashData = await studentService.getDashboard();
        setDashboard(dashData.data);
      } catch (error) {
        console.error('Error fetching student dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <section className="container mx-auto max-w-5xl px-4 py-4 md:py-6 space-y-6">
        <StudentTabs />

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-row items-center justify-between pb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Promedio Global</h3>
                  <i className="fa-solid fa-graduation-cap text-muted-foreground"></i>
                </div>
                <div className="text-2xl font-bold">{dashboard?.promedioGlobal ? dashboard.promedioGlobal.toFixed(2) : '-'} / 10</div>
              </div>
              
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-row items-center justify-between pb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Clases Matriculadas</h3>
                  <i className="fa-solid fa-book text-muted-foreground"></i>
                </div>
                <div className="text-2xl font-bold">{dashboard?.clasesMatriculadas || 0}</div>
              </div>
            </div>

            {dashboard?.alarmas && dashboard.alarmas.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-foreground mb-4">Avisos Importantes</h3>
                <div className="space-y-3">
                  {dashboard.alarmas.map((alarma, idx) => (
                    <div key={idx} className="rounded-lg border border-warning/50 bg-warning/10 p-4 text-warning-foreground flex items-center">
                      <i className="fa-solid fa-triangle-exclamation mr-3 text-warning"></i>
                      <span>{alarma}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </>
        )}
      </section>
    </div>
  );
};
