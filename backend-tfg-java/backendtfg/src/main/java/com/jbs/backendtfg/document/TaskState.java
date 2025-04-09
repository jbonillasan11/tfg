package com.jbs.backendtfg.document;

public enum TaskState {
    PENDING, //Tarea creada, sin resolver
    IN_PROGRESS, //Tarea parcialmente resuelta, con guardado de progreso
    COMPLETED, //Tarea resuelta y enviada
    CORRECTED; //Tarea corregida por el profesor
}
