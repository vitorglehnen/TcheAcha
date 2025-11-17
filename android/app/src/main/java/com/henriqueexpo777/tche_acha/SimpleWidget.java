package com.henriqueexpo777.tche_acha;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;

public class SimpleWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {

        for (int widgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_simple);

            // texto estático para testar
            views.setTextViewText(R.id.widgetText, "Widget funcionando!");

            appWidgetManager.updateAppWidget(widgetId, views);
        }
    }
}
