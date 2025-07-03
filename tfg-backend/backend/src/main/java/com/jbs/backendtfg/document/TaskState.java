package com.jbs.backendtfg.document;

public enum TaskState {
    PENDING, //Tarea creada, sin resolver
    IN_PROGRESS, //Tarea parcialmente resuelta, con guardado de progreso
    COMPLETED, //Tarea resuelta y enviada
    CORRECTION_IN_PROGRESS, //Tarea en proceso de corrección por el profesor
    CORRECTED; //Tarea corregida por el profesor
}
